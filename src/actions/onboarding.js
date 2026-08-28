"use server"
import { createClient } from "@/lib/supabase/server"

const ALLOWED_GENDERS = ["male", "female", "non-binary", "prefer-not-to-say"]

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

export async function saveOnboardingAction(prevState, formData) {
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

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to complete onboarding." }
  }

  const profile = {
    id: user.id,
    age: age.value,
    gender,
    height_cm: height.value,
    weight_kg: weight.value,
    allergies: cleanText(formData.get("allergies")),
    medications: cleanText(formData.get("medications")),
    conditions: cleanText(formData.get("conditions")),
  }

  const { error } = await supabase.from("patient_profiles").upsert(profile)

  if (error) {
    console.error("Onboarding save failed:", error.status, error.code, error.message)
    return { error: "We couldn't save your profile. Please try again." }
  }

  return { success: true }
}
