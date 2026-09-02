import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/profile"
import PatientDetail from "./PatientDetail"

export const metadata = {
  title: "Patient | TeleMed AI",
  description: "Patient medical profile and history.",
}

export default async function DoctorPatientPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  // RLS only lets attending doctors read the patient's profile — if this
  // doctor has no appointment/consultation with them, the query returns null.
  const { data: patient } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", id)
    .maybeSingle()

  if (!patient) {
    notFound()
  }

  const { data: medical } = await supabase
    .from("patient_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  const { data: reports = [] } = await supabase
    .from("reports")
    .select("id, title, status, ai_summary, created_at")
    .eq("patient_id", id)
    .order("created_at", { ascending: false })

  const { data: prescriptions = [] } = await supabase
    .from("prescriptions")
    .select(
      "id, medication_name, dosage, frequency, instructions, status, refill_requested, refill_requested_at, created_at"
    )
    .eq("patient_id", id)
    .eq("doctor_id", user.id)
    .order("created_at", { ascending: false })

  const { data: appointments = [] } = await supabase
    .from("appointments")
    .select("id, scheduled_at, duration_min, reason, status, consultation_notes")
    .eq("patient_id", id)
    .eq("doctor_id", user.id)
    .order("scheduled_at", { ascending: false })

  return (
    <PatientDetail
      patient={patient}
      medical={medical || null}
      reports={reports || []}
      prescriptions={prescriptions || []}
      appointments={appointments || []}
    />
  )
}