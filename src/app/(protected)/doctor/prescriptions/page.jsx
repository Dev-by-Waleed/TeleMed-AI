import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/profile"
import DoctorPrescriptions from "./DoctorPrescriptions"

export const metadata = {
  title: "Prescriptions | TeleMed AI",
  description: "Write and manage prescriptions for your patients.",
}

export default async function DoctorPrescriptionsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  // Prescriptions this doctor wrote, RLS-scoped to doctor_id = auth.uid().
  const { data: prescriptions = [] } = await supabase
    .from("prescriptions")
    .select(
      "id, patient_id, medication_name, dosage, frequency, instructions, status, refill_requested, refill_requested_at, created_at"
    )
    .eq("doctor_id", user.id)
    .order("created_at", { ascending: false })

  // Patient display names — prescriptions.patient_id points at auth.users, so
  // names come from profiles via a JS-side join.
  const patientIds = [...new Set((prescriptions || []).map((p) => p.patient_id).filter(Boolean))]
  let patientMap = {}
  if (patientIds.length > 0) {
    const { data: patients = [] } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", patientIds)
    patientMap = Object.fromEntries(patients.map((p) => [p.id, p.full_name]))
  }
  const formatted = (prescriptions || []).map((p) => ({
    ...p,
    patient_name: p.patient_id ? patientMap[p.patient_id] || "Patient" : "Patient",
  }))

  // The doctor's own patients, for the "New prescription" picker.
  const { data: doctorAppointments = [] } = await supabase.rpc("get_doctor_appointments")
  const seen = new Map()
  ;(doctorAppointments || []).forEach((a) => {
    if (a.patient_id && !seen.has(a.patient_id)) {
      seen.set(a.patient_id, a.patient_name || "Patient")
    }
  })
  const patients = [...seen.entries()].map(([id, name]) => ({ id, patient_name: name }))

  return <DoctorPrescriptions prescriptions={formatted} patients={patients} />
}