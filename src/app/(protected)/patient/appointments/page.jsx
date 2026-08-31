import { redirect } from "next/navigation"
import BookingForm from "./BookingForm"
import { createClient } from "@/lib/supabase/server"
import { getUser, hasCompletedOnboarding } from "@/lib/supabase/profile"

export const metadata = {
  title: "Book Appointment | TeleMed AI",
  description: "Book a consultation with a doctor.",
}

export default async function BookAppointmentPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  // Patients must complete onboarding before booking.
  const completed = await hasCompletedOnboarding(supabase, user.id)
  if (!completed) {
    redirect("/features/onboarding")
  }

  const { data: doctors = [] } = await supabase
    .from("doctors")
    .select("id, full_name, specialty, rating, reviews_count")
    .eq("active_status", "active")
    .order("full_name", { ascending: true })

  return (
    <BookingForm doctors={doctors} />
  )
}
