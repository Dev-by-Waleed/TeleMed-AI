import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import DoctorsAdminView from "./DoctorsAdminView"

export const metadata = {
  title: "Manage Doctors | TeleMed AI",
  description: "Review and manage doctor accounts.",
}

export default async function AdminDoctorsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: doctors = [] } = await supabase.rpc("admin_get_doctors")

  return (
    <DoctorsAdminView
      doctors={doctors || []}
    />
  )
}
