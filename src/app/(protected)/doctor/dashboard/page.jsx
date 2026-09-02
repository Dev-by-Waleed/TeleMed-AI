import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/profile';
import PendingRequests from './PendingRequests';
import TodayAppointments from './TodayAppointments';
import {
  Menu,
  Activity,
  Clock,
  CalendarDays
} from 'lucide-react';

export default async function DoctorDashboard() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  const userName = user?.user_metadata?.full_name || user?.email || 'Doctor'
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const currentDate = new Date().toLocaleDateString('en-US', options)

  // Real dynamic data (RLS scopes appointments to this doctor,
  // RPC joins profiles for patient names so we don't depend on auth.users FKs)
  const [{ data: todayAppointments = [] }, { data: nextResult = [] }, { data: allAppointments = [] }] = await Promise.all([
    supabase.rpc('get_doctor_today_appointments'),
    supabase.rpc('get_doctor_next_appointment'),
    supabase.rpc('get_doctor_appointments'),
  ])

  const upcoming = nextResult[0] || null
  const totalToday = todayAppointments.length

  // Bookings that still need the doctor's decision, oldest first.
  const pendingRequests = (allAppointments || [])
    .filter((a) => a.status === 'pending')
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))

  function fmtTime(iso) {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <>
      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
        
        {/* Mobile Top Nav Fallback */}
        <header
          className="md:hidden flex justify-between items-center h-16 px-4 border-b w-full shrink-0"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            TeleMed
          </div>
          <button style={{ color: 'var(--color-on-surface)' }}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-on-background)' }}>
                Good Morning, {userName}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                Here is your clinical overview for today.
              </p>
            </div>

            <div
              className="text-xs py-1.5 px-3 rounded-full flex items-center gap-2 border shadow-sm"
              style={{
                backgroundColor: 'var(--color-surface-container)',
                borderColor: 'var(--color-outline-variant)',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              <CalendarDays className="w-4 h-4" />
              <span>{currentDate}</span>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Summary Widget 1 */}
            <div
              className="md:col-span-6 border rounded-xl p-4 shadow-sm flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
              }}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Total Consultations
                </h3>
                <Activity className="w-5 h-5" style={{ color: 'var(--color-primary-container)' }} />
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold" style={{ color: 'var(--color-on-surface)' }}>{totalToday}</span>
                <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Today</span>
              </div>
            </div>

            {/* Summary Widget 2 */}
            <div
              className="md:col-span-6 border rounded-xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden group"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
              }}
            >
              <div
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-500 blur-xl"
                style={{ backgroundColor: 'var(--color-primary-fixed-dim)' }}
              />
              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Next Appointment
                </h3>
                <Clock className="w-5 h-5" style={{ color: 'var(--color-primary-container)' }} />
              </div>
              <div className="mt-6 relative z-10">
                <p className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
                  {upcoming ? fmtTime(upcoming.scheduled_at) : '—'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {upcoming
                    ? `${upcoming.patient_name || 'Patient'} • ${upcoming.reason || 'Consultation'}`
                    : 'No upcoming appointments'}
                </p>
              </div>
            </div>

            {/* Main Content Row: Today's Appointments */}
            <div
              className="md:col-span-8 border rounded-xl shadow-sm flex flex-col"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
              }}
            >
              <div
                className="p-4 border-b flex justify-between items-center"
                style={{ borderColor: 'var(--color-outline-variant)' }}
              >
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>
Today&apos;s Appointments
                </h2>
                <a
                  href="/doctor/consultations"
                  className="text-xs font-semibold hover:underline"
                  style={{ color: 'var(--color-primary-container)' }}
                >
                  View All
                </a>
              </div>

              <TodayAppointments appointments={todayAppointments || []} />
            </div>

            {/* Patient Requests Queue */}
            <div
              className="md:col-span-4 border rounded-xl shadow-sm flex flex-col"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
              }}
            >
              <div
                className="p-4 border-b flex justify-between items-center"
                style={{ borderColor: 'var(--color-outline-variant)' }}
              >
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>
                  Patient Requests
                </h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary-fixed-dim)', color: 'var(--color-primary)' }}
                >
                  {pendingRequests.length}
                </span>
              </div>

              <PendingRequests requests={pendingRequests} />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}