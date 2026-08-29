import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/profile';
import {
  Filter,
  Star,
  Clock,
  Video,
  VideoOff,
  Pill,
  FileText,
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

  function fmtTime(iso) {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }
  function fmtEnd(iso, min) {
    return new Date(new Date(iso).getTime() + min * 60000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
      {/* Main Container */}
      <main className="p-12 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
            Welcome back, {firstName}
          </h1>
          <p className="text-base text-[var(--color-on-surface-variant)]">
            Here is an overview of your health dashboard today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Available Doctors (70% on lg screens) */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
                Available Doctors
              </h2>
              <button
                type="button"
                aria-label="Filter doctors"
                className="text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Doctor Cards List */}
            {availableDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 relative bg-[var(--color-surface-container-high)] flex items-center justify-center text-lg font-bold text-[var(--color-primary)]">
                  {doc.full_name.charAt(0)}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                    {doc.full_name}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">
                    {doc.specialty}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-[var(--color-foreground)]">
                      {doc.rating}
                    </span>
                    <span className="text-xs text-[var(--color-outline)]">
                      ({doc.reviews_count} reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Right Column: Upcoming & Quick Actions (30% on lg screens) */}
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
                    {nextAppointment ? (new Date(nextAppointment.scheduled_at).toDateString() === new Date().toDateString() ? 'Today' : 'Upcoming') : 'No Upcoming'}
                  </span>
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
                  <button
                    disabled
                    type="button"
                    className="w-full bg-[var(--color-secondary)] text-[var(--color-on-surface-variant)]/60 cursor-not-allowed px-4 py-2.5 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 border border-[var(--color-outline-variant)]/40"
                  >
                    <VideoOff className="w-4 h-4" />
                    Join Chat (Available at {fmtTime(nextAppointment.scheduled_at)})
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col gap-4">
              <h3 className="text-base font-semibold text-[var(--color-foreground)] border-b border-[var(--color-outline-variant)] pb-3">
                Quick Actions
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[var(--color-secondary)] flex items-center justify-center group-hover:bg-[var(--color-primary-fixed-dim)] transition-colors">
                      <Pill className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <span className="text-sm font-medium">Request Refill</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[var(--color-secondary)] flex items-center justify-center group-hover:bg-[var(--color-primary-fixed-dim)] transition-colors">
                      <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <span className="text-sm font-medium">View Lab Results</span>
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}