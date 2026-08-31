import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import DoctorConsultationsView from "./DoctorConsultationsView"

export const metadata = {
  title: "My Patients | TeleMed AI",
  description: "Your patients and their appointments.",
}

export default async function DoctorConsultationsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "doctor" && role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: appointments = [] } = await supabase.rpc("get_doctor_appointments")

  return <DoctorConsultationsView appointments={appointments || []} />
}
