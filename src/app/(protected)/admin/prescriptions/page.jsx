import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import PrescriptionsAdminView from "./PrescriptionsAdminView"

export const metadata = {
  title: "Prescriptions | TeleMed AI",
  description: "Oversight of prescriptions and refill requests.",
}

export default async function AdminPrescriptionsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: prescriptions = [] } = await supabase.rpc("admin_get_prescriptions")

  return (
    <PrescriptionsAdminView
      prescriptions={prescriptions || []}
    />
  )
}