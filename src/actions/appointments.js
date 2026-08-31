"use server"
import { createClient } from "@/lib/supabase/server"

const SLOT_DURATION_MIN = 30

export async function bookAppointmentAction(prevState, formData) {
  const doctorId = formData.get("doctorId")
  const scheduledAt = formData.get("scheduledAt")
  const reason = formData.get("reason")

  if (!doctorId) {
    return { error: "Please select a doctor." }
  }
  if (!scheduledAt) {
    return { error: "Please choose a date and time." }
  }

  const date = new Date(scheduledAt)
  if (Number.isNaN(date.getTime())) {
    return { error: "Please choose a valid date and time." }
  }
  if (date.getTime() < Date.now()) {
    return { error: "Appointment time must be in the future." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to book an appointment." }
  }

  const { error } = await supabase.from("appointments").insert({
    patient_id: user.id,
    doctor_id: doctorId,
    scheduled_at: date.toISOString(),
    duration_min: SLOT_DURATION_MIN,
    reason: reason || null,
    status: "pending",
  })

  if (error) {
    console.error("Booking failed:", error.status, error.code, error.message)
    return { error: "We couldn't book your appointment. Please try again." }
  }

  return { success: true }
}
