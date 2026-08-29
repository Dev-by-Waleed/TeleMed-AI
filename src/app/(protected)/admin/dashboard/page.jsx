import { Users, Stethoscope, FileText, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: "Admin Dashboard | TeleMed AI",
  description: "TeleMed AI admin dashboard.",
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('admin_get_stats')
  const s = data?.[0]

  const stats = [
    { label: 'Total Patients', value: s?.total_patients ?? 0, icon: Users },
    { label: 'Active Doctors', value: s?.active_doctors ?? 0, icon: Stethoscope },
    { label: 'Consultations', value: s?.total_consultations ?? 0, icon: FileText },
    { label: 'Pending Reviews', value: s?.pending_reviews ?? 0, icon: ShieldAlert },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
      <main className="p-6 md:p-10 max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
            Admin Dashboard
          </h1>
          <p className="text-base text-[var(--color-on-surface-variant)]">
            Overview of the TeleMed AI platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col gap-4"
            >
              <Icon className="w-7 h-7 text-[var(--color-primary)]" />
              <div>
                <p className="text-3xl font-bold text-[var(--color-foreground)]">{value}</p>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">
            Platform Management
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Doctor approvals, patient management, and platform analytics pages are under construction.
          </p>
        </div>
      </main>
    </div>
  )
}