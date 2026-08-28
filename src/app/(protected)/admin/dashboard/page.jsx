import { Users, Stethoscope, FileText, ShieldAlert } from 'lucide-react'

export const metadata = {
  title: "Admin Dashboard | TeleMed AI",
  description: "TeleMed AI admin dashboard.",
}

const stats = [
  { label: 'Total Patients', value: '12,500', icon: Users },
  { label: 'Active Doctors', value: '1,200', icon: Stethoscope },
  { label: 'Consultations', value: '25,000', icon: FileText },
  { label: 'Pending Reviews', value: '48', icon: ShieldAlert },
]

export default function AdminDashboard() {
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