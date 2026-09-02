'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { completeAppointmentAction } from '@/actions/doctor-appointments'

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function TodayAppointments({ appointments = [] }) {
  const router = useRouter()
  const [completingId, setCompletingId] = useState(null)
  const [, startTransition] = useTransition()

  async function markComplete(appointmentId) {
    setCompletingId(appointmentId)
    const formData = new FormData()
    formData.set('appointmentId', appointmentId)
    const result = await completeAppointmentAction(null, formData)
    setCompletingId(null)
    if (result?.success) {
      startTransition(() => router.refresh())
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-2">
        <p className="p-3 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          No appointments scheduled for today.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <ul className="divide-y" style={{ borderColor: 'var(--color-outline-variant)' }}>
        {appointments.map((appt) => {
          const patientName = appt.patient_name || 'Patient'
          const initials = patientName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
          const confirmed = appt.status === 'confirmed'
          return (
            <li
              key={appt.id}
              className="p-3 rounded-lg transition-colors flex items-center justify-between hover:bg-[var(--color-surface-container-low)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                    {patientName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {appt.reason || 'Consultation'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium" style={{ color: 'var(--color-on-surface)' }}>
                    {fmtTime(appt.scheduled_at)}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {appt.duration_min} Min
                  </p>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={
                    appt.status === 'confirmed'
                      ? { backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary-dark)' }
                      : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }
                  }
                >
                  {appt.status}
                </span>
                {confirmed && (
                  <button
                    type="button"
                    disabled={completingId === appt.id}
                    onClick={() => markComplete(appt.id)}
                    className="text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary-dark)' }}
                  >
                    {completingId === appt.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    Complete
                  </button>
                )}
                <a
                  href={`/doctor/consultation/${appt.id}`}
                  className="text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary-dark)' }}
                >
                  Open
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}