"use client";

import React, { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { CalendarDays, CheckCircle2, XCircle, Loader2, AlarmClock } from 'lucide-react';
import { toast } from 'sonner';
import { setAppointmentStatusAction } from '@/actions/admin';
import { fmtDateTime } from '@/lib/date';

function statusPill(status) {
  const colors = {
    pending: { color: '#b45309', bg: '#fef3c7' },
    confirmed: { color: '#047857', bg: '#d1fae5' },
    cancelled: { color: '#b91c1c', bg: '#fee2e2' },
    completed: { color: '#0e7490', bg: '#cffafe' },
  };
  const c = colors[status] || { color: '#6b7280', bg: '#f3f4f6' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color: c.color, backgroundColor: c.bg }}>
      {status}
    </span>
  );
}

function ActionsCell({ appt }) {
  const [state, formAction, isPending] = useActionState(setAppointmentStatusAction, null);
  const canCancel = appt.status !== 'cancelled' && appt.status !== 'completed';
  const canComplete = appt.status === 'pending' || appt.status === 'confirmed';

  useEffect(() => {
    if (state?.success) {
      toast.success('Appointment status updated!');
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);
  if (!canCancel && !canComplete) return <span className="text-xs text-[var(--color-on-surface-variant)]">No actions</span>;
  return (
    <div className="flex items-center gap-2">
      {canComplete && (
        <form action={formAction}>
          <input type="hidden" name="appointment_id" value={appt.id} />
          <input type="hidden" name="status" value="completed" />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0e7490] hover:bg-[#155e75] disabled:opacity-50 transition-colors"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            Complete
          </button>
        </form>
      )}
      {canCancel && (
        <form action={formAction}>
          <input type="hidden" name="appointment_id" value={appt.id} />
          <input type="hidden" name="status" value="cancelled" />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#b91c1c] hover:bg-[#991b1b] disabled:opacity-50 transition-colors"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
            Cancel
          </button>
        </form>
      )}
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap ${className}`}>{children || '—'}</td>;
}

export default function AppointmentsAdminView({ appointments = [] }) {
  const [statusFilter, setStatusFilter] = useState('all');

  const counts = appointments.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  const filtered = statusFilter === 'all' ? appointments : appointments.filter((a) => a.status === statusFilter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Appointments</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">Oversee bookings platform-wide and step in with admin actions.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatusFilter(f.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === f.id
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-foreground)]'
            }`}
          >
            {f.label}
            {f.id !== 'all' && <span className="opacity-80">({counts[f.id] || 0})</span>}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-[var(--color-outline-variant)]">
              <tr>
                <Th>Patient</Th><Th>Doctor</Th><Th>Specialty</Th><Th>Scheduled</Th><Th>Duration</Th><Th>Reason</Th><Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <CalendarDays className="w-8 h-8 text-[var(--color-on-surface-variant)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-on-surface-variant)]">No appointments match this filter.</p>
                  </td>
                </tr>
              )}
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-[var(--color-secondary)]/40">
                  <Td>{a.patient_name}</Td>
                  <Td>{a.doctor_name}</Td>
                  <Td>{a.specialty}</Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <AlarmClock className="w-3.5 h-3.5 text-[var(--color-outline)]" />
                      {fmtDateTime(a.scheduled_at) || '—'}
                    </div>
                  </Td>
                  <Td>{a.duration_min ? `${a.duration_min} min` : '—'}</Td>
                  <Td className="max-w-[220px] truncate">{a.reason}</Td>
                  <td className="px-4 py-3">{statusPill(a.status)}</td>
                  <td className="px-4 py-3"><ActionsCell appt={a} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}