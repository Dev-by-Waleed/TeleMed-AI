"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { summarizeDocument } from "@/lib/ai"

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB per PRD

function isPdf(file) {
  return (
    file?.type === "application/pdf" ||
    (file?.name || "").toLowerCase().endsWith(".pdf")
  )
}

async function toBase64(file) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ""
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return { bytes, base64: btoa(binary) }
}

export async function uploadReportAction(prevState, formData) {
  const file = formData.get("file")

  if (!file || !isPdf(file)) {
    return { error: "Please upload a PDF file only." }
  }
  if (file.size > MAX_BYTES) {
    return { error: "File must be 10 MB or smaller." }
  }

  const { bytes, base64 } = await toBase64(file)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be signed in to upload a report." }
  }

  const fileId = crypto.randomUUID()
  const filePath = `${user.id}/${fileId}.pdf`

  // 1. Store the PDF securely (folder is the patient id → RLS-scoped).
  const { error: uploadError } = await supabase.storage
    .from("reports")
    .upload(filePath, bytes, { contentType: "application/pdf" })
  if (uploadError) {
    console.error("Report upload failed:", uploadError.message)
    return { error: "We couldn't upload your report. Please try again." }
  }

  // 2. Persist the report row (status: uploaded) before running AI.
  const { data: report, error: insertError } = await supabase
    .from("reports")
    .insert({
      patient_id: user.id,
      title: file.name,
      file_url: filePath,
      status: "uploaded",
    })
    .select("id, title, created_at, status, ai_summary, file_url")
    .single()
  if (insertError) {
    console.error("Report insert failed:", insertError.message)
    return { error: "We couldn't save your report. Please try again." }
  }

  // 3. Run AI summarization. On success the report becomes "analyzed"; on
  //    failure it is marked "failed" (not left stuck in "uploaded") so the
  //    patient sees the file saved with a retry option.
  const result = await summarizeDocument(base64)

  let finalReport = report
  if (result.ok) {
    const { error: updateError } = await supabase
      .from("reports")
      .update({ status: "analyzed", ai_summary: result.summary })
      .eq("id", report.id)
    if (updateError) {
      console.error("Report status update failed:", updateError.message)
      return {
        success: true,
        report: { ...report, status: "failed" },
        aiError: "We couldn't save the AI summary. Please retry.",
      }
    }
    finalReport = { ...report, status: "analyzed", ai_summary: result.summary }
  } else {
    console.error("AI summarization failed:", result.error)
    await supabase.from("reports").update({ status: "failed" }).eq("id", report.id)
    finalReport = { ...report, status: "failed" }
  }

  return { success: true, report: finalReport, aiError: result.ok ? null : result.error }
}

export async function retrySummarizeAction(reportId) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be signed in." }
  }

  // Fetch the report and verify ownership.
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("id, file_url, status")
    .eq("id", reportId)
    .eq("patient_id", user.id)
    .single()

  if (fetchError || !report) {
    return { error: "Report not found." }
  }

  // Download the PDF from storage and re-summarize.
  const { data: fileData, error: dlError } = await supabase.storage
    .from("reports")
    .download(report.file_url)

  if (dlError) {
    console.error("Download failed:", dlError.message)
    return { error: "Could not download the report file." }
  }

  const bytes = new Uint8Array(await fileData.arrayBuffer())
  let binary = ""
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  const base64 = btoa(binary)

  const result = await summarizeDocument(base64)
  if (result.ok) {
    const { data: updated } = await supabase
      .from("reports")
      .update({ status: "analyzed", ai_summary: result.summary })
      .eq("id", reportId)
      .select("id, title, created_at, status, ai_summary, file_url")
      .single()
    return {
      success: true,
      report: updated || { id: reportId, status: "analyzed", ai_summary: result.summary },
    }
  } else {
    console.error("Retry summarization failed:", result.error)
    await supabase.from("reports").update({ status: "failed" }).eq("id", reportId)
    return { error: "AI analysis failed: " + result.error }
  }
}

// Deletes a report row and its stored PDF. Ownership is enforced twice: by
// querying with patient_id = auth.uid() (RLS + explicit filter) and by trying
// to remove only that patient's storage folder.
export async function deleteReportAction(reportId) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be signed in to delete a report." }
  }

  // Fetch and verify the report belongs to this patient.
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("id, file_url")
    .eq("id", reportId)
    .eq("patient_id", user.id)
    .maybeSingle()

  if (fetchError || !report) {
    return { error: "Report not found." }
  }

  // Best-effort removal of the stored PDF. Deleting the DB row is the source
  // of truth; if the storage deletion fails we still remove the row but log it.
  if (report.file_url) {
    const { error: storageError } = await supabase.storage
      .from("reports")
      .remove([report.file_url])
    if (storageError) {
      console.error("Report file removal failed:", storageError.message)
    }
  }

  const { error } = await supabase.from("reports").delete().eq("id", reportId)
  if (error) {
    console.error("Report delete failed:", error.status, error.code, error.message)
    return { error: "We couldn't delete your report. Please try again." }
  }

  revalidatePath("/patient/reports")
  return { success: true }
}

// Returns a short-lived signed URL for downloading the original PDF. Only the
// owning patient can obtain it (ownership + RLS enforced in the query).
export async function getReportDownloadUrl(reportId) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be signed in." }
  }

  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("id, file_url")
    .eq("id", reportId)
    .eq("patient_id", user.id)
    .maybeSingle()

  if (fetchError || !report || !report.file_url) {
    return { error: "Report not found." }
  }

  const { data, error } = await supabase.storage
    .from("reports")
    .createSignedUrl(report.file_url, 60) // 60s validity

  if (error) {
    console.error("Signed URL creation failed:", error.message)
    return { error: "Could not prepare the file for download." }
  }

  return { success: true, url: data.signedUrl, title: report.title || "report.pdf" }
}