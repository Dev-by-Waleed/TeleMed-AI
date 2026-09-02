"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

const DOCTOR_PATHS = ["/doctor/dashboard", "/doctor/consultations", "/doctor/consultation-history"]

// Fetch the appointment and verify the signed-in user is the treating doctor.
// Returns { appointment, error } — one side is null.
async function loadOwnAppointment(appointmentId) {
  if (!appointmentId) {
    return { appointment: null, error: "Missing appointment." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { appointment: null, error: "You must be signed in." }
  }

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, doctor_id, status")
    .eq("id", appointmentId)
    .maybeSingle()

  if (!appointment) {
    return { appointment: null, error: "Appointment not found." }
  }
  if (appointment.doctor_id !== user.id) {
    return { appointment: null, error: "Only the treating doctor can manage this appointment." }
  }

  return { appointment, error: null }
}

// Doctor accepts a pending booking (pending -> confirmed). RLS already scopes
// the update to appointments where doctor_id = auth.uid().
export async function confirmAppointmentAction(prevState, formData) {
  const { appointment, error } = await loadOwnAppointment(formData.get("appointmentId"))
  if (error) return { error }

  if (appointment.status !== "pending") {
    return { error: "Only pending appointment requests can be confirmed." }
  }

  const supabase = await createClient()
  const { error: updateError } = await supabase
    .from("appointments")
    .update({ status: "confirmed" })
    .eq("id", appointment.id)

  if (updateError) {
    console.error("Confirm failed:", updateError.status, updateError.code, updateError.message)
    return { error: "We couldn't confirm this appointment. Please try again." }
  }

  revalidatePath(DOCTOR_PATHS[0])
  revalidatePath(DOCTOR_PATHS[1])
  return { success: true }
}

// Doctor declines a pending booking (pending -> cancelled). The patient is
// notified by the trg_appointment_notifications trigger.
export async function declineAppointmentAction(prevState, formData) {
  const { appointment, error } = await loadOwnAppointment(formData.get("appointmentId"))
  if (error) return { error }

  if (appointment.status !== "pending") {
    return { error: "Only pending appointment requests can be declined." }
  }

  const supabase = await createClient()
  const { error: updateError } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointment.id)

  if (updateError) {
    console.error("Decline failed:", updateError.status, updateError.code, updateError.message)
    return { error: "We couldn't decline this appointment. Please try again." }
  }

  revalidatePath(DOCTOR_PATHS[0])
  revalidatePath(DOCTOR_PATHS[1])
  return { success: true }
}

// Doctor completes a confirmed consultation (confirmed -> completed). This is
// the state that makes the visit visible in patient reviews and doctor/patient
// summaries.
export async function completeAppointmentAction(prevState, formData) {
  const { appointment, error } = await loadOwnAppointment(formData.get("appointmentId"))
  if (error) return { error }

  if (appointment.status !== "confirmed") {
    return { error: "Only confirmed consultations can be marked complete." }
  }

  const supabase = await createClient()
  const { error: updateError } = await supabase
    .from("appointments")
    .update({ status: "completed" })
    .eq("id", appointment.id)

  if (updateError) {
    console.error("Complete failed:", updateError.status, updateError.code, updateError.message)
    return { error: "We couldn't complete this consultation. Please try again." }
  }

  for (const path of DOCTOR_PATHS) {
    revalidatePath(path)
  }
  revalidatePath("/patient/my-appointments")
  return { success: true }
}