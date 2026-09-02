"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// Doctor writes a prescription for one of their patients. RLS limits inserts
// to rows where doctor_id = auth.uid(), and we additionally require an existing
// doctor–patient relationship (at least one appointment) before prescribing.
export async function createPrescriptionAction(prevState, formData) {
  const patientId = formData.get("patientId")
  const medicationName = (formData.get("medicationName") || "").trim()
  const dosage = (formData.get("dosage") || "").trim()
  const frequency = (formData.get("frequency") || "").trim()
  const instructions = (formData.get("instructions") || "").trim()

  if (!patientId) {
    return { error: "Please choose a patient." }
  }
  if (!medicationName) {
    return { error: "Medication name is required." }
  }
  if (!dosage) {
    return { error: "Dosage is required (e.g. 500 mg)." }
  }
  if (!frequency) {
    return { error: "Frequency is required (e.g. twice daily)." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to prescribe." }
  }

  const { data: relationship } = await supabase
    .from("appointments")
    .select("id")
    .eq("doctor_id", user.id)
    .eq("patient_id", patientId)
    .limit(1)
    .maybeSingle()

  if (!relationship) {
    return { error: "You can only prescribe to your own patients." }
  }

  const { error } = await supabase.from("prescriptions").insert({
    patient_id: patientId,
    doctor_id: user.id,
    medication_name: medicationName,
    dosage,
    frequency,
    instructions: instructions || null,
    status: "active",
  })

  if (error) {
    console.error("Prescribe failed:", error.status, error.code, error.message)
    return { error: "We couldn't save the prescription. Please try again." }
  }

  revalidatePath("/doctor/prescriptions")
  return { success: true }
}

// Doctor ends an active prescription (active -> discontinued). Refill requests
// stay visible on the patient side as history of the now-discontinued item.
export async function discontinuePrescriptionAction(prevState, formData) {
  const prescriptionId = formData.get("prescriptionId")

  if (!prescriptionId) {
    return { error: "Missing prescription." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in." }
  }

  const { data: prescription } = await supabase
    .from("prescriptions")
    .select("id, doctor_id, status")
    .eq("id", prescriptionId)
    .maybeSingle()

  if (!prescription || prescription.doctor_id !== user.id) {
    return { error: "You can only manage prescriptions you wrote." }
  }
  if (prescription.status !== "active") {
    return { error: "Only active prescriptions can be discontinued." }
  }

  const { error } = await supabase
    .from("prescriptions")
    .update({ status: "discontinued" })
    .eq("id", prescriptionId)

  if (error) {
    console.error("Discontinue failed:", error.status, error.code, error.message)
    return { error: "We couldn't update this prescription. Please try again." }
  }

  revalidatePath("/doctor/prescriptions")
  return { success: true }
}