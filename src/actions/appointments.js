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

  // Server-side availability guard: reject the booking if another
  // pending/confirmed appointment overlaps this slot for the same doctor.
  const { data: available } = await supabase.rpc("is_slot_available", {
    p_doctor_id: doctorId,
    p_start: date.toISOString(),
    p_duration: SLOT_DURATION_MIN,
  })

  if (available === false) {
    return { error: "That time slot is no longer available. Please choose another time." }
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

// Cancel an upcoming appointment owned by the current patient.
// Rescheduling is handled by cancelling and re-booking via the booking page,
// so this one action covers both the "Cancel" and "Reschedule" flows.
export async function cancelAppointmentAction(prevState, formData) {
  const appointmentId = formData.get("appointmentId")

  if (!appointmentId) {
    return { error: "Missing appointment." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to cancel an appointment." }
  }

  // Re-fetch to confirm ownership and that it can still be cancelled.
  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, patient_id, status, scheduled_at")
    .eq("id", appointmentId)
    .maybeSingle()

  if (!appointment || appointment.patient_id !== user.id) {
    return { error: "You can only cancel your own appointments." }
  }

  if (appointment.status === "cancelled") {
    return { error: "This appointment is already cancelled." }
  }

  if (appointment.status === "completed") {
    return { error: "Completed appointments cannot be cancelled." }
  }

  if (new Date(appointment.scheduled_at).getTime() < Date.now()) {
    return { error: "Past appointments cannot be cancelled." }
  }

  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId)

  if (error) {
    console.error("Cancel failed:", error.status, error.code, error.message)
    return { error: "We couldn't cancel this appointment. Please try again." }
  }

  return { success: true }
}

// Reschedule = cancel the existing appointment and send the patient back to the
// booking page to pick a new slot. Cancelling prevents the patient from holding
// two slots for the same booking.
export async function rescheduleAppointmentAction(prevState, formData) {
  const appointmentId = formData.get("appointmentId")

  if (!appointmentId) {
    return { error: "Missing appointment." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to reschedule an appointment." }
  }

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, patient_id, status, scheduled_at")
    .eq("id", appointmentId)
    .maybeSingle()

  if (!appointment || appointment.patient_id !== user.id) {
    return { error: "You can only reschedule your own appointments." }
  }

  if (appointment.status === "cancelled") {
    return { error: "This appointment is already cancelled." }
  }

  if (appointment.status === "completed") {
    return { error: "Completed appointments cannot be rescheduled." }
  }

  if (new Date(appointment.scheduled_at).getTime() < Date.now()) {
    return { error: "Past appointments cannot be rescheduled." }
  }

  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId)

  if (error) {
    console.error("Reschedule failed:", error.status, error.code, error.message)
    return { error: "We couldn't reschedule this appointment. Please try again." }
  }

  return { success: true, redirectTo: "/patient/appointments" }
}
