import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, hasCompletedOnboarding } from "@/lib/supabase/profile"
import ReportsClient from "./ReportsClient"

export const metadata = {
  title: "My Reports | TeleMed AI",
  description: "Upload and analyze laboratory reports using the AI Hub.",
}

export default async function PatientReportsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  // Patients must complete onboarding before using report features.
  if (!(await hasCompletedOnboarding(supabase, user.id))) {
    redirect("/features/onboarding")
  }

  const { data: reports = [] } = await supabase
    .from("reports")
    .select("id, title, created_at, status, ai_summary, file_url")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })

  return <ReportsClient initialReports={reports || []} />
}