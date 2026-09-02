import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import NotificationsAdminView from "./NotificationsAdminView"

export const metadata = {
  title: "Notifications | TeleMed AI",
  description: "Broadcast announcements and review recent notifications.",
}

export default async function AdminNotificationsPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: notifications = [] } = await supabase.rpc("admin_get_notifications", {
    p_limit: 50,
  })

  return (
    <NotificationsAdminView
      notifications={notifications || []}
    />
  )
}