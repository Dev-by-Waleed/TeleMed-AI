import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/profile"
import DoctorProfileForm from "./DoctorProfileForm"

export const metadata = {
  title: "My Profile | TeleMed AI",
  description: "Update your doctor profile.",
}

export default async function DoctorProfilePage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  const { data: doctor } = await supabase
    .from("doctors")
    .select("id, full_name, specialty, bio")
    .eq("id", user.id)
    .maybeSingle()

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  const { data: requests = [] } = await supabase
    .from("doctor_profile_requests")
    .select("id, requested_full_name, requested_specialty, reason, status, admin_response, created_at")
    .eq("doctor_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <DoctorProfileForm
      doctor={doctor || null}
      userEmail={user.email || ""}
      fullName={user.user_metadata?.full_name || doctor?.full_name || ""}
      avatarUrl={profileRow?.avatar_url || null}
      requests={requests || []}
    />
  )
}