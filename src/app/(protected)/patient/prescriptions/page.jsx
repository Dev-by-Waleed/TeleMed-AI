import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, hasCompletedOnboarding } from "@/lib/supabase/profile"
import PrescriptionsClient from "./PrescriptionsClient"

export const metadata = {
  title: "Medications & Refills | TeleMed AI",
  description: "View your prescriptions and request refills.",
}

export default async function PatientPrescriptionsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  const completed = await hasCompletedOnboarding(supabase, user.id)
  if (!completed) {
    redirect("/features/onboarding")
  }

  // The patient's prescriptions, RLS-scoped to patient_id = auth.uid().
  const { data: prescriptions = [] } = await supabase
    .from("prescriptions")
    .select(
      "id, medication_name, dosage, frequency, instructions, status, refill_requested, refill_requested_at, doctor_id, created_at"
    )
    .order("created_at", { ascending: false })

  // prescriptions.doctor_id points at auth.users, so the prescribing doctor's
  // name comes from the doctors table via a JS-side join.
  const doctorIds = [...new Set(prescriptions.map((p) => p.doctor_id).filter(Boolean))]
  let doctorMap = {}
  if (doctorIds.length > 0) {
    const { data: doctors = [] } = await supabase
      .from("doctors")
      .select("id, full_name")
      .in("id", doctorIds)
    doctorMap = Object.fromEntries(doctors.map((d) => [d.id, d]))
  }
  const formatted = (prescriptions || []).map((p) => ({
    ...p,
    doctor: p.doctor_id ? doctorMap[p.doctor_id] || null : null,
  }))

  return <PrescriptionsClient prescriptions={formatted} />
}