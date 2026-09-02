'use client';

import Link from 'next/link';
import { VideoOff, CalendarDays, Clock, MessageSquare, Stethoscope, User } from 'lucide-react';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
function statusLabel(status) {
  return (status || 'pending').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function DoctorConsultationsView({ appointments }) {
  const list = appointments || []

  // Group appointments by patient so "My Patients" lists each distinct patient
  // once, with their most recent consultation attached.
  const patients = []
  const byPatient = new Map()
  for (const a of [...list].sort((x, y) => new Date(y.scheduled_at) - new Date(x.scheduled_at))) {
    const key = a.patient_id || a.patient_name || 'unknown'
    if (!byPatient.has(key)) {
      byPatient.set(key, true)
      patients.push(a)
    }
  }

  return (
    <main
      className="flex-1 overflow-y-auto p-4 md:p-8"
      style={{ backgroundColor: 'var(--color-surface-bright)' }}
    >
      <div className="max-w-[1440px] mx-auto space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-on-surface)' }}>
            My Patients
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            Patients who have booked or consulted with you. One card per patient with their latest visit.
          </p>
        </div>

        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: 'var(--color-surface-container)' }}
            >
              <VideoOff className="w-8 h-8 text-[var(--color-on-surface-variant)]" />
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
              No Patients Yet
            </h2>
            <p className="text-sm mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
              You&apos;ll see your patients here as soon as someone books a consultation with you.
            </p>
            <Link
              href="/doctor/dashboard"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-surface-card)' }}
            >
              <CalendarDays className="w-4 h-4" />
              View Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map((a) => (
              <PatientCard key={a.patient_id || a.id} a={a} consultationCount={list.filter((x) => (x.patient_id || x.patient_name) === (a.patient_id || a.patient_name)).length} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function PatientCard({ a, consultationCount }) {
  const patientName = a.patient_name || 'Patient'
  const initials = patientName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className="rounded-xl border shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[var(--color-surface-container-low)]"
      style={{
        backgroundColor: 'var(--color-surface-card)',
        borderColor: 'var(--color-outline-variant)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
          style={{
            backgroundColor: 'var(--color-surface-container-high)',
            color: 'var(--color-primary)',
          }}
        >
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
              {patientName}
            </p>
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
              style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }}>
              <Stethoscope className="w-3 h-3" />
              {consultationCount} {consultationCount === 1 ? 'visit' : 'visits'}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
            {a.reason || 'Consultation'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
          <Clock className="w-4 h-4" />
          <div>
            <div className="font-medium" style={{ color: 'var(--color-on-surface)' }}>
              {fmtDate(a.scheduled_at)}
            </div>
            <div className="text-[10px]">{fmtTime(a.scheduled_at)}</div>
          </div>
        </div>
        <Link
          href={`/doctor/consultation/${a.id}`}
          className="text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors hover:opacity-90 shrink-0"
          style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary-dark)' }}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Talk
        </Link>
        {a.patient_id && (
          <Link
            href={`/doctor/patients/${a.patient_id}`}
            className="text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors hover:opacity-90 shrink-0"
            style={{ color: 'var(--color-primary)', border: '1px solid var(--color-outline-variant)' }}
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </Link>
        )}
      </div>
    </div>
  );
}
