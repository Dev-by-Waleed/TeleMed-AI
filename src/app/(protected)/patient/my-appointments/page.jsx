import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, hasCompletedOnboarding } from "@/lib/supabase/profile"
import AppointmentsClient from "./AppointmentsClient"

export const metadata = {
  title: "My Appointments | TeleMed AI",
  description: "View and manage your upcoming and past appointments.",
}

export default async function MyAppointmentsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  const completed = await hasCompletedOnboarding(supabase, user.id)
  if (!completed) {
    redirect("/features/onboarding")
  }

  // All patient appointments ordered by date, newest first.
  // RLS automatically scopes results to the logged-in patient.
  const { data: appointments = [] } = await supabase
    .from("appointments")
    .select(
      "id, doctor_id, scheduled_at, duration_min, reason, status, consultation_notes, created_at"
    )
    .order("scheduled_at", { ascending: false })

  // appointments.doctor_id points at auth.users, so the doctor's display
  // details (name/specialty) come from the doctors table via a JS-side join.
  const doctorIds = [...new Set(appointments.map((a) => a.doctor_id).filter(Boolean))]
  let doctorMap = {}
  if (doctorIds.length > 0) {
    const { data: doctors = [] } = await supabase
      .from("doctors")
      .select("id, full_name, specialty")
      .in("id", doctorIds)
    doctorMap = Object.fromEntries(doctors.map((d) => [d.id, d]))
  }
  const formatted = (appointments || []).map((a) => ({ ...a, doctor: doctorMap[a.doctor_id] || null }))

  // The patient's own reviews, keyed by appointment, to know which completed
  // consultations have already been rated.
  const { data: myReviews = [] } = await supabase
    .from("reviews")
    .select("appointment_id, rating")
    .eq("patient_id", user.id)

  const reviewMap = Object.fromEntries((myReviews || []).map((r) => [r.appointment_id, r.rating]))

  return <AppointmentsClient appointments={formatted} reviewMap={reviewMap} />
}