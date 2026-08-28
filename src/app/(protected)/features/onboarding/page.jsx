import { redirect } from "next/navigation"
import PatientOnboardingForm from "./PatientOnboardingForm"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/profile"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  return (
    <div>
      <PatientOnboardingForm />
    </div>
  )
}