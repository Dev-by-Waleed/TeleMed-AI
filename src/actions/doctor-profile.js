"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

function cleanText(value) {
  const trimmed = (value || "").trim()
  return trimmed || null
}

export async function updateDoctorProfileAction(prevState, formData) {
  const bio = cleanText(formData.get("bio"))

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to update your profile." }
  }

  // The doctors row is the source of truth for the doctor directory. Full name
  // and specialty are intentionally NOT editable here — both are admin-managed
  // (set when a doctor is created in the admin panel) to keep directory
  // credentials trustworthy. Only the bio is doctor-editable.
  const { error: doctorError } = await supabase
    .from("doctors")
    .update({ bio })
    .eq("id", user.id)

  if (doctorError) {
    console.error("Doctor profile update failed:", doctorError.status, doctorError.code, doctorError.message)
    return { error: "We couldn't save your profile. Please try again." }
  }

  revalidatePath("/doctor/profile")
  revalidatePath("/doctor/dashboard")
  revalidatePath("/doctor")

  return { success: true }
}