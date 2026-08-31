import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"
import AdminDashboardView from "./AdminDashboardView"

export const metadata = {
  title: "Admin Dashboard | TeleMed AI",
  description: "TeleMed AI admin dashboard.",
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect("/login")
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const [statsRes, patientsRes, doctorsRes, apptsRes] = await Promise.all([
    supabase.rpc("admin_get_stats"),
    supabase.rpc("admin_get_patients"),
    supabase.rpc("admin_get_doctors"),
    supabase.rpc("admin_get_appointments"),
  ])

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
      <AdminDashboardView
        stats={statsRes.data?.[0] || {}}
        patients={patientsRes.data || []}
        doctors={doctorsRes.data || []}
        appointments={apptsRes.data || []}
      />
    </div>
  )
}
