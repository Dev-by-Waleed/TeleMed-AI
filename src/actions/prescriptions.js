"use server"
import { createClient } from "@/lib/supabase/server"

// Flip a patient-owned prescription to refill_requested. The DB trigger then
// timestamps it and notifies the prescribing doctor + confirms to the patient.
export async function requestRefillAction(prevState, formData) {
  const prescriptionId = formData.get("prescriptionId")

  if (!prescriptionId) {
    return { error: "Missing prescription." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to request a refill." }
  }

  const { data: prescription } = await supabase
    .from("prescriptions")
    .select("id, patient_id, medication_name, refill_requested, status")
    .eq("id", prescriptionId)
    .maybeSingle()

  if (!prescription || prescription.patient_id !== user.id) {
    return { error: "You can only request refills for your own prescriptions." }
  }

  if (prescription.refill_requested) {
    return { error: "A refill is already requested for this medication." }
  }

  if (prescription.status !== "active") {
    return { error: "A refill can only be requested for active medications." }
  }

  const { error } = await supabase
    .from("prescriptions")
    .update({ refill_requested: true })
    .eq("id", prescriptionId)

  if (error) {
    console.error("Refill request failed:", error.status, error.code, error.message)
    return { error: "We couldn't request the refill. Please try again." }
  }

  return { success: true }
}