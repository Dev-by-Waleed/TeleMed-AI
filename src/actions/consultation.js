"use server"
import { createClient } from "@/lib/supabase/server"

// Doctor writes the post-consultation summary/notes. RLS restricts updates to
// appointments the doctor owns (doctor_id = auth.uid()).
export async function saveConsultationNotesAction(prevState, formData) {
  const appointmentId = formData.get("appointmentId")
  const notes = (formData.get("notes") || "").trim()

  if (!appointmentId) {
    return { error: "Missing appointment." }
  }
  if (!notes) {
    return { error: "Summary cannot be empty." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to save a summary." }
  }

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, doctor_id")
    .eq("id", appointmentId)
    .maybeSingle()

  if (!appointment) {
    return { error: "Appointment not found." }
  }
  if (appointment.doctor_id !== user.id) {
    return { error: "Only the treating doctor can add consultation notes." }
  }

  const { error } = await supabase
    .from("appointments")
    .update({ consultation_notes: notes })
    .eq("id", appointmentId)

  if (error) {
    console.error("Notes save failed:", error.status, error.code, error.message)
    return { error: "We couldn't save the summary. Please try again." }
  }

  return { success: true }
}