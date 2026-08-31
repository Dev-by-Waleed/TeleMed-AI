import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import ConsultationsAdminView from "./ConsultationsAdminView"

export const metadata = {
  title: "Consultations | TeleMed AI",
  description: "Review all consultations across the platform.",
}

export default async function AdminConsultationsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: consultations = [] } = await supabase.rpc("admin_get_consultations")

  return (
    <ConsultationsAdminView
      consultations={consultations || []}
    />
  )
}
