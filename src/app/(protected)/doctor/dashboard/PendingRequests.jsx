'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, X, Loader2, User } from 'lucide-react'
import { fmtDate, fmtTime } from '@/lib/date'
import { confirmAppointmentAction, declineAppointmentAction } from '@/actions/doctor-appointments'

export default function PendingRequests({ requests = [] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState(null)
  const [, startTransition] = useTransition()

  async function run(action, appointmentId) {
    setBusyId(appointmentId)
    const formData = new FormData()
    formData.set('appointmentId', appointmentId)
    const result = await action(null, formData)
    setBusyId(null)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Request updated.')
      startTransition(() => router.refresh())
    }
  }

  if (requests.length === 0) {
    return (
      <div className="flex-1 p-3 flex items-center justify-center">
        <p className="text-sm text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
          No pending requests
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-2 overflow-y-auto divide-y" style={{ borderColor: 'var(--color-outline-variant)' }}>
        {requests.map((req) => (
          <div key={req.id} className="p-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}
              >
                {(req.patient_name || 'P').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-on-surface)' }}>
                  {req.patient_name || 'Patient'}
                </p>
                <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <User className="w-3 h-3" />
                  {fmtDate(req.scheduled_at)} • {fmtTime(req.scheduled_at)}
                </p>
              </div>
            </div>
            {req.reason && (
              <p className="text-xs mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                {req.reason}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                disabled={busyId === req.id}
                onClick={() => run(confirmAppointmentAction, req.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {busyId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Confirm
              </button>
              <button
                type="button"
                disabled={busyId === req.id}
                onClick={() => run(declineAppointmentAction, req.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 border"
                style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface-variant)' }}
              >
                <X className="w-3.5 h-3.5" />
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}