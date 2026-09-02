import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import MessagesAdminView from "./MessagesAdminView"

export const metadata = {
  title: "Messages | TeleMed AI",
  description: "Moderate consultation chat messages.",
}

export default async function AdminMessagesPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const { data: messages = [] } = await supabase.rpc("admin_get_messages")

  return (
    <MessagesAdminView
      messages={messages || []}
    />
  )
}