import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import PatientsAdminView from "./PatientsAdminView"

export const metadata = {
  title: "Manage Patients | TeleMed AI",
  description: "Review and manage patient accounts.",
}

export default async function AdminPatientsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: patients = [] } = await supabase.rpc("admin_get_patients")

  return (
    <PatientsAdminView
      patients={patients || []}
    />
  )
}
