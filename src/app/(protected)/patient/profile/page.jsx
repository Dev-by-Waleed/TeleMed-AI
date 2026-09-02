import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/profile"
import ProfileForm from "./ProfileForm"

export const metadata = {
  title: "My Profile | TeleMed AI",
  description: "View and update your TeleMed medical profile.",
}

export default async function PatientProfilePage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("patient_profiles")
    .select(
      "age, gender, height_cm, weight_kg, allergies, medications, conditions, emergency_contact, blood_group, notes, past_surgeries, smoking_status, chronic_illness_notes"
    )
    .eq("id", user.id)
    .maybeSingle()

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  return (
    <ProfileForm
      profile={profile || null}
      userEmail={user.email || ""}
      fullName={user.user_metadata?.full_name || ""}
      avatarUrl={profileRow?.avatar_url || null}
    />
  )
}