"use server"
import { createClient } from "@/lib/supabase/server"
import { summarizeDocument } from "@/lib/ai"

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB per PRD

function isPdf(file) {
  return (
    file?.type === "application/pdf" ||
    (file?.name || "").toLowerCase().endsWith(".pdf")
  )
}

export async function uploadReportAction(prevState, formData) {
  const file = formData.get("file")

  if (!file || !isPdf(file)) {
    return { error: "Please upload a PDF file only." }
  }
  if (file.size > MAX_BYTES) {
    return { error: "File must be 10 MB or smaller." }
  }

  const bytes = new Uint8Array(await file.arrayBuffer())

  // Chunked base64 to avoid hitting the call-stack limit on large files.
  let binary = ""
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  const base64 = btoa(binary)

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
    .select("id")
    .single()
  if (insertError) {
    console.error("Report insert failed:", insertError.message)
    return { error: "We couldn't save your report. Please try again." }
  }

  // 3. Run AI summarization. On failure the report stays "uploaded" so the
  //    patient still has the file (PRD reliability requirement).
  const result = await summarizeDocument(base64)
  if (result.ok) {
    await supabase
      .from("reports")
      .update({ status: "analyzed", ai_summary: result.summary })
      .eq("id", report.id)
  } else {
    console.error("AI summarization failed:", result.error)
  }

  return { success: true, id: report.id }
}
