import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import ReviewsAdminView from "./ReviewsAdminView"

export const metadata = {
  title: "Reviews | TeleMed AI",
  description: "Moderate patient reviews and ratings.",
}

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: reviews = [] } = await supabase.rpc("admin_get_reviews")

  return (
    <ReviewsAdminView
      reviews={reviews || []}
    />
  )
}