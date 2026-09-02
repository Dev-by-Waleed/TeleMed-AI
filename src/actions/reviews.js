"use server"
import { createClient } from "@/lib/supabase/server"

// Leave a rating + optional comment for a completed appointment. RLS allows
// patients to insert reviews with their own patient_id only; the unique
// constraint on appointment_id guarantees one review per consultation.
export async function submitReviewAction(prevState, formData) {
  const appointmentId = formData.get("appointmentId")
  const rating = Number(formData.get("rating"))
  const comment = (formData.get("comment") || "").trim()

  if (!appointmentId) {
    return { error: "Missing appointment." }
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Please choose a rating between 1 and 5." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to leave a review." }
  }

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, patient_id, doctor_id, status")
    .eq("id", appointmentId)
    .maybeSingle()

  if (!appointment || appointment.patient_id !== user.id) {
    return { error: "You can only review your own consultations." }
  }
  if (appointment.status !== "completed") {
    return { error: "Only completed consultations can be reviewed." }
  }

  const { error } = await supabase.from("reviews").insert({
    patient_id: user.id,
    doctor_id: appointment.doctor_id,
    appointment_id: appointmentId,
    rating,
    comment: comment || null,
  })

  if (error) {
    if (error.code === "23505") {
      return { error: "You have already reviewed this consultation." }
    }
    console.error("Review failed:", error.status, error.code, error.message)
    return { error: "We couldn't save your review. Please try again." }
  }

  return { success: true }
}