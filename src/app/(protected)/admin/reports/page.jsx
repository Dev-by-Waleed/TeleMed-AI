import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import ReportsAdminView from "./ReportsAdminView"

export const metadata = {
  title: "Reports | TeleMed AI",
  description: "Oversight of patient report uploads and AI summaries.",
}

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: reports = [] } = await supabase.rpc("admin_get_reports")

  return (
    <ReportsAdminView
      reports={reports || []}
    />
  )
}
