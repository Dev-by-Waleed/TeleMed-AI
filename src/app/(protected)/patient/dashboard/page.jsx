import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/profile';
import AvailableDoctors from './AvailableDoctors';
import { fmtTime, fmtEnd, fmtDate, fmtDayHeader } from '@/lib/date';
import {
  Clock,
  Video,
  Pill,
  FileText,
  CalendarDays,
  Bell,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';

export default async function PatientDashboard() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  const fullName = user?.user_metadata?.full_name || user?.email || 'there'
  const firstName = fullName.split(' ')[0]

  // Real dynamic data from Supabase (RLS scopes results to the caller)
  const { data: availableDoctors = [] } = await supabase
    .from('doctors')
    .select('id, full_name, specialty, rating, reviews_count')
    .order('rating', { ascending: false })

  // Next appointment via RPC (joins doctors/profiles for name + specialty
  // instead of relying on auth.users FK embeds)
  const { data: nextResult = [] } = await supabase.rpc('get_patient_next_appointment')
  const nextAppointment = nextResult[0] || null

  // Overview stats
  const { data: activeAppointments } = await supabase.rpc('get_patient_active_appointments')
  const { data: activeMeds } = await supabase
    .from('prescriptions')
    .select('id')
    .eq('patient_id', user.id)
    .eq('status', 'active')
  const { data: reports } = await supabase
    .from('reports')
    .select('id')
    .eq('patient_id', user.id)
  const { data: unread } = await supabase
    .from('notifications')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_read', false)

  // Latest completed consultation that has a doctor-written summary.
  const { data: latestSummary = [] } = await supabase
    .from('appointments')
    .select('id, doctor_id, scheduled_at, consultation_notes')
    .eq('patient_id', user.id)
    .eq('status', 'completed')
    .not('consultation_notes', 'is', null)
    .order('scheduled_at', { ascending: false })
    .limit(1)
  const latest = (latestSummary || [])[0] || null
  let latestDoctorName = 'Your doctor'
  if (latest) {
    const { data: doc = [] } = await supabase
      .from('doctors')
      .select('full_name')
      .eq('id', latest.doctor_id)
      .limit(1)
    if (doc[0]?.full_name) latestDoctorName = doc[0].full_name
  }

  const stats = [
    { label: 'Upcoming', value: (activeAppointments || []).length, href: '/patient/my-appointments', icon: CalendarDays },
    { label: 'Active Medications', value: (activeMeds || []).length, href: '/patient/prescriptions', icon: Pill },
    { label: 'Medical Reports', value: (reports || []).length, href: '/patient/reports', icon: FileText },
    { label: 'Unread Notifications', value: (unread || []).length, href: '/patient/dashboard', icon: Bell },
  ]

  // Doctors the patient already has a pending/confirmed appointment with, so
  // their cards can surface a "Booked" state instead of a plain book button.
  const bookedDoctorIds = new Set((activeAppointments || []).map((a) => a.doctor_id))

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
      <main className="p-10 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
            Welcome back, {firstName}
          </h1>
          <p className="text-base text-[var(--color-on-surface-variant)]">
            Here is an overview of your health dashboard today.
          </p>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="w-11 h-11 rounded-full bg-[var(--color-secondary)] group-hover:bg-[var(--color-primary-fixed-dim)] transition-colors flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-[var(--color-foreground)] leading-none">
                  {value}
                </p>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 truncate">
                  {label}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Available Doctors */}
          <AvailableDoctors doctors={availableDoctors} bookedDoctorIds={bookedDoctorIds} />

          {/* Right Column: Upcoming + Latest summary */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
              Upcoming
            </h2>

            {/* Next Appointment Card */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-tertiary)]" />

              <div className="pl-2">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-[var(--color-secondary)] text-[var(--color-foreground)] px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                    {nextAppointment ? (fmtDayHeader(nextAppointment.scheduled_at) === 'Today' ? 'Today' : 'Upcoming') : 'No Upcoming'}
                  </span>
                  <a
                    href="/patient/my-appointments"
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    View all
                  </a>
                </div>

                {nextAppointment ? (
                  <div className="mb-6 space-y-2">
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                      {nextAppointment.doctor_name || 'Doctor'}
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--color-outline)]" />
                      {fmtTime(nextAppointment.scheduled_at)} - {fmtEnd(nextAppointment.scheduled_at, nextAppointment.duration_min)}
                    </p>
                    <p className="text-sm text-[var(--color-on-surface-variant)] flex items-center gap-2">
                      <Video className="w-4 h-4 text-[var(--color-outline)]" />
                      Video Consultation
                    </p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] capitalize">
                      {nextAppointment.specialty} • {nextAppointment.reason || 'Consultation'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                    You have no upcoming appointments. Browse doctors above to book one.
                  </p>
                )}

                {nextAppointment && (
                  <a
                    href={`/patient/consultation/${nextAppointment.id}`}
                    className="w-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-4 py-2.5 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 shadow-sm transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    Join Chat
                  </a>
                )}
              </div>
            </div>

            {/* Latest consultation summary */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[var(--color-foreground)] flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[var(--color-primary)]" />
                  Latest Summary
                </h3>
                <a
                  href="/patient/my-appointments"
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  History
                </a>
              </div>

              {latest ? (
                <>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    {latestDoctorName} &middot; {fmtDate(latest.scheduled_at)}
                  </p>
                  <p className="text-sm text-[var(--color-on-surface)] line-clamp-4 whitespace-pre-line">
                    {latest.consultation_notes}
                  </p>
                  <a
                    href="/patient/my-appointments"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline self-start"
                  >
                    Read in Appointments
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </>
              ) : (
                <p className="text-sm text-[var(--color-on-surface-variant)]">
                  No consultation summaries yet. They appear here after completed visits.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}