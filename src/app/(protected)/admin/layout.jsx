import AdminSidebar from "@/Components/layout/AdminSidebar"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/profile"

export const metadata = {
  title: "Admin Portal | TeleMed AI",
  description: "Your TeleMed AI admin portal.",
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const user = await getUser(supabase)

  const fullName = user?.user_metadata?.full_name || user?.email || ''
  const userEmail = user?.email || ''

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user?.id)
    .maybeSingle()
  const avatarUrl = profileRow?.avatar_url || null

  return (
    <div
      className="h-screen flex font-sans overflow-hidden antialiased"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <AdminSidebar userEmail={userEmail} userName={fullName} avatarUrl={avatarUrl} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}