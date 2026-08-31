'use client';

import React, { useActionState } from 'react';
import { Stethoscope, Loader2, Ban, CheckCircle2 } from 'lucide-react';
import { setUserStatusAction } from '@/actions/admin';

function statusPill(value) {
  const colors = {
    active: { color: '#047857', bg: '#d1fae5' },
    invited: { color: '#b45309', bg: '#fef3c7' },
    suspended: { color: '#b91c1c', bg: '#fee2e2' },
    inactive: { color: '#6b7280', bg: '#f3f4f6' },
  };
  const c = colors[value] || { color: 'var(--color-on-surface-variant)', bg: 'var(--color-surface-container-low)' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color: c.color, backgroundColor: c.bg }}>
      {value}
    </span>
  );
}

function StatusToggle({ doctor }) {
  const [state, formAction, isPending] = useActionState(setUserStatusAction, null);
  const suspended = doctor.account_status === 'suspended';
  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="user_id" value={doctor.id} />
      <input type="hidden" name="role" value="doctor" />
      <input type="hidden" name="status" value={suspended ? 'active' : 'suspended'} />
      <button
        type="submit"
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
          suspended
            ? 'text-white bg-[#047857] hover:bg-[#065f46]'
            : 'text-white bg-[#b91c1c] hover:bg-[#991b1b]'
        }`}
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : suspended ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
        {suspended ? 'Activate' : 'Suspend'}
      </button>
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap">{children || '—'}</td>;
}

export default function DoctorsAdminView({ doctors = [] }) {
  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Manage Doctors</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">Suspend, reactivate, or review doctor accounts.</p>
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-[var(--color-outline-variant)]">
              <tr>
                <Th>Name</Th><Th>Email</Th><Th>Specialty</Th><Th>Status</Th><Th>Source</Th><Th>Temp Password</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {doctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Stethoscope className="w-8 h-8 text-[var(--color-on-surface-variant)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-on-surface-variant)]">No doctors yet.</p>
                  </td>
                </tr>
              )}
              {doctors.map((d) => (
                <tr key={d.id} className="hover:bg-[var(--color-secondary)]/40">
                  <Td>{d.full_name}</Td>
                  <Td>{d.email}</Td>
                  <Td>{d.specialty}</Td>
                  <td className="px-4 py-3">{statusPill(d.account_status || d.active_status)}</td>
                  <Td>{d.created_by_admin ? 'Admin' : 'Self-signup'}</Td>
                  <Td>{d.temp_password_status === 'pending_change' ? 'Pending change' : '—'}</Td>
                  <td className="px-4 py-3"><StatusToggle doctor={d} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
