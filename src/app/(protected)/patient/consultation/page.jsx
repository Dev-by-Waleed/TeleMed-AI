import { redirect } from 'next/navigation'
import { Clock, Video, Stethoscope } from 'lucide-react'
import PatientConsultation from '@/Components/ui/PatientConsultation'
import { createClient } from '@/lib/supabase/server'
import { getUser, hasCompletedOnboarding } from '@/lib/supabase/profile'

export const metadata = {
  title: "Consultation | TeleMed AI",
  description: "Join your consultations.",
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function fmtDay(iso) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  if (sameDay(d, today)) return 'Today'
  if (sameDay(d, tomorrow)) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default async function PatientConsultationPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    redirect("/login")
  }

  const completed = await hasCompletedOnboarding(supabase, user.id)
  if (!completed) {
    redirect("/features/onboarding")
  }

  // All the patient's active (future, pending/confirmed) consultations.
  const { data: active = [] } = await supabase.rpc("get_patient_active_appointments")

  if (active.length === 0) {
    return (
      <div>
        <PatientConsultation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
      <main className="p-8 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
            Your Consultations
          </h1>
          <p className="text-base text-[var(--color-on-surface-variant)]">
            Your active and upcoming consultations are listed below. Join a consultation to start chatting with your doctor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {active.map((a) => (
            <div
              key={a.id}
              className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-tertiary)]" />

              <div className="pl-2 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-[var(--color-secondary)] text-[var(--color-foreground)] px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                    {fmtDay(a.scheduled_at)}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] capitalize">
                    {a.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                  {a.doctor_name || 'Doctor'}
                </h3>

                <div className="mt-2 space-y-2">
                  <p className="text-sm text-[var(--color-on-surface-variant)] flex items-center gap-2 capitalize">
                    <Stethoscope className="w-4 h-4 text-[var(--color-outline)] shrink-0" />
                    {a.specialty || 'General Practice'}
                  </p>
                  <p className="text-sm text-[var(--color-on-surface-variant)] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--color-outline)] shrink-0" />
                    {fmtTime(a.scheduled_at)}
                  </p>
                </div>
                {a.reason && (
                  <p className="mt-3 text-xs text-[var(--color-on-surface-variant)]">
                    {a.reason}
                  </p>
                )}
              </div>

              <a
                href={`/patient/consultation/${a.id}`}
                className="ml-2 inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
              >
                <Video className="w-4 h-4" />
                Join Chat
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
