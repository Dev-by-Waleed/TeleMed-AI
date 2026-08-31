import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"

// Loads everything the consultation room needs and validates the current user
// is a participant of the given appointment. Returns { ok, ... } with { ok:false }
// when the user is not allowed or data is missing.
export async function loadConsultationRoom(appointmentId) {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) return { ok: false, reason: "unauthenticated" }
  if (!appointmentId) return { ok: false, reason: "missing" }

  const role = await getUserRole(supabase, user.id)

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("id, patient_id, doctor_id, scheduled_at, duration_min, reason, status")
    .eq("id", appointmentId)
    .maybeSingle()

  if (error || !appointment) {
    console.error("Consultation room load failed:", error?.message)
    return { ok: false, reason: "notfound" }
  }

  // Resolve display names from profiles (patients + doctors) and the doctors
  // table (for specialty). Appointments FK to auth.users, so we look these up
  // directly instead of via PostgREST embeds.
  const { data: patientProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", appointment.patient_id)
    .maybeSingle()

  const { data: doctorProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", appointment.doctor_id)
    .maybeSingle()

  const { data: doctorRow } = await supabase
    .from("doctors")
    .select("specialty")
    .eq("id", appointment.doctor_id)
    .maybeSingle()

  const patientName = patientProfile?.full_name || "Patient"
  const doctorName = doctorProfile?.full_name || "Doctor"
  const specialty = doctorRow?.specialty || null

  // Only the two participants (plus admins, via RLS) may open the room.
  const isPatient = appointment.patient_id === user.id
  const isDoctor = appointment.doctor_id === user.id
  const isAdmin = role === "admin"
  if (!isPatient && !isDoctor && !isAdmin) {
    return { ok: false, reason: "forbidden" }
  }

  const counterpartName = isPatient ? doctorName : patientName

  // Patient onboarding context (patient_profiles) for the patient in the appointment.
  const { data: pprofile } = await supabase
    .from("patient_profiles")
    .select("*")
    .eq("id", appointment.patient_id)
    .maybeSingle()

  // Patient's uploaded reports (if any).
  const { data: reports = [] } = await supabase
    .from("reports")
    .select("id, title, file_url, ai_summary, status")
    .eq("patient_id", appointment.patient_id)
    .order("created_at", { ascending: false })

  const { data: messages = [] } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at, appointment_id")
    .eq("appointment_id", appointmentId)
    .order("created_at", { ascending: true })

  return {
    ok: true,
    role,
    appointmentId,
    currentUserId: user.id,
    currentUserName: user?.user_metadata?.full_name || user?.email || counterpartName,
    counterpartName,
    doctorSpecialty: specialty,
    reason: appointment.reason || null,
    initialMessages: messages,
    context: {
      age: pprofile?.age ?? null,
      gender: pprofile?.gender ?? null,
      weight_kg: pprofile?.weight_kg ?? null,
      height_cm: pprofile?.height_cm ?? null,
      allergies: pprofile?.allergies ?? null,
      medications: pprofile?.medications ?? null,
      conditions: pprofile?.conditions ?? null,
      emergency_contact: pprofile?.emergency_contact ?? null,
      reports,
    },
  }
}
