import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import ProfileRequestsAdminView from "./ProfileRequestsAdminView"

export const metadata = {
  title: "Profile Requests | TeleMed AI",
  description: "Review doctor profile change requests.",
}

export default async function AdminProfileRequestsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: requests = [] } = await supabase.rpc("admin_get_profile_requests")

  return <ProfileRequestsAdminView requests={requests || []} />
}
