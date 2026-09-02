import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import AppointmentsAdminView from "./AppointmentsAdminView"

export const metadata = {
  title: "Appointments | TeleMed AI",
  description: "Manage and moderate appointments.",
}

export default async function AdminAppointmentsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: appointments = [] } = await supabase.rpc("admin_get_appointments")

  return (
    <AppointmentsAdminView
      appointments={appointments || []}
    />
  )
}