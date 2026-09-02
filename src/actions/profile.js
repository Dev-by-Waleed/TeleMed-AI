"use server"
import { createClient } from "@/lib/supabase/server"

const ALLOWED_GENDERS = ["male", "female", "non-binary", "prefer-not-to-say"]
const ALLOWED_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const ALLOWED_SMOKING = ["never", "former", "current"]

function cleanText(value) {
  const trimmed = (value || "").trim()
  return trimmed || null
}

function parsePositiveInt(value, { min, max, label }) {
  const num = Number(value)
  if (!Number.isInteger(num) || num < min || num > max) {
    return { error: `${label} must be a whole number between ${min} and ${max}.` }
  }
  return { value: num }
}

export async function updateProfileAction(prevState, formData) {
  const gender = formData.get("gender") || ""

  const age = parsePositiveInt(formData.get("age"), { min: 1, max: 150, label: "Age" })
  if (age.error) return { error: age.error }

  const height = parsePositiveInt(formData.get("height"), { min: 50, max: 250, label: "Height" })
  if (height.error) return { error: height.error }

  const weight = parsePositiveInt(formData.get("weight"), { min: 2, max: 400, label: "Weight" })
  if (weight.error) return { error: weight.error }

  if (!ALLOWED_GENDERS.includes(gender)) {
    return { error: "Please select a valid gender." }
  }

  const emergencyContact = cleanText(formData.get("emergencyContact"))
  if (!emergencyContact) {
    return { error: "Emergency contact number is required." }
  }

  const bloodGroup = formData.get("bloodGroup") || ""
  if (bloodGroup && !ALLOWED_BLOOD_GROUPS.includes(bloodGroup)) {
    return { error: "Please select a valid blood group." }
  }

  const smokingStatus = formData.get("smokingStatus") || ""
  if (smokingStatus && !ALLOWED_SMOKING.includes(smokingStatus)) {
    return { error: "Please select a valid smoking status." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to update your profile." }
  }

  const profile = {
    age: age.value,
    gender,
    height_cm: height.value,
    weight_kg: weight.value,
    allergies: cleanText(formData.get("allergies")),
    medications: cleanText(formData.get("medications")),
    conditions: cleanText(formData.get("conditions")),
    emergency_contact: emergencyContact,
    blood_group: bloodGroup || null,
    notes: cleanText(formData.get("notes")),
    past_surgeries: cleanText(formData.get("pastSurgeries")),
    smoking_status: smokingStatus || null,
    chronic_illness_notes: cleanText(formData.get("chronicIllnessNotes")),
    completed_onboarding: true,
  }

  const { error } = await supabase.from("patient_profiles").upsert(profile)

  if (error) {
    console.error("Profile update failed:", error.status, error.code, error.message)
    return { error: "We couldn't save your profile. Please try again." }
  }

  return { success: true }
}