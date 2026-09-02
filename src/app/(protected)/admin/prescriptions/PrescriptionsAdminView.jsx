"use client";

import React, { useState } from 'react';
import { useActionState } from 'react';
import { Pill, RefreshCcw, Check, X, Loader2, FileText } from 'lucide-react';
import { resolveRefillAction } from '@/actions/admin';

function statusPill(status, refillRequested) {
  if (refillRequested) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color: '#1d4ed8', backgroundColor: '#dbeafe' }}>
        Refill requested
      </span>
    );
  }
  const colors = {
    active: { color: '#047857', bg: '#d1fae5' },
    completed: { color: '#0e7490', bg: '#cffafe' },
    discontinued: { color: '#b91c1c', bg: '#fee2e2' },
  };
  const c = colors[status] || { color: '#6b7280', bg: '#f3f4f6' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color: c.color, backgroundColor: c.bg }}>
      {status}
    </span>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap">{children || '—'}</td>;
}

function RefillRow({ rx }) {
  const [state, formAction, isPending] = useActionState(resolveRefillAction, null);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
          <RefreshCcw className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-foreground)]">
            {rx.medication_name} <span className="font-normal text-[var(--color-on-surface-variant)]">· {rx.dosage}</span>
          </p>
          <p className="text-xs text-[var(--color-on-surface-variant)] truncate">
            {rx.patient_name || 'Patient'} → {rx.doctor_name || 'Doctor'} · requested {rx.refill_requested_at ? new Date(rx.refill_requested_at).toLocaleDateString() : ''}
          </p>
        </div>
      </div>
      <form action={formAction} className="flex items-center gap-2">
        <input type="hidden" name="prescription_id" value={rx.id} />
        <input type="hidden" name="decision" value="approved" />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#047857] hover:bg-[#065f46] disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Approve
        </button>
      </form>
      <form action={formAction} className="flex items-center gap-2">
        <input type="hidden" name="prescription_id" value={rx.id} />
        <input type="hidden" name="decision" value="denied" />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#b91c1c] hover:bg-[#991b1b] disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
          Deny
        </button>
      </form>
      {state?.error && <span className="text-xs text-red-600 w-full">{state.error}</span>}
    </div>
  );
}

export default function PrescriptionsAdminView({ prescriptions = [] }) {
  const [tab, setTab] = useState('refills');

  const pending = prescriptions.filter((p) => p.refill_requested && p.status === 'active');
  const active = prescriptions.filter((p) => p.status === 'active' && !p.refill_requested);
  const archived = prescriptions.filter((p) => p.status !== 'active');

  const tabs = [
    { id: 'refills', label: 'Pending refills', count: pending.length },
    { id: 'active', label: 'Active', count: active.length },
    { id: 'archived', label: 'Completed / Discontinued', count: archived.length },
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Prescriptions</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">Monitor medications across the platform and resolve refill requests.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
          <RefreshCcw className="w-6 h-6 text-blue-600 mb-3" />
          <p className="text-3xl font-bold text-[var(--color-foreground)]">{pending.length}</p>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Pending refill requests</p>
        </div>
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
          <Pill className="w-6 h-6 text-[var(--color-primary)] mb-3" />
          <p className="text-3xl font-bold text-[var(--color-foreground)]">{active.length}</p>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Active prescriptions</p>
        </div>
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
          <FileText className="w-6 h-6 text-[var(--color-on-surface-variant)] mb-3" />
          <p className="text-3xl font-bold text-[var(--color-foreground)]">{prescriptions.length}</p>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Total prescriptions</p>
        </div>
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="flex border-b border-[var(--color-outline-variant)] overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)] border-transparent hover:text-[var(--color-foreground)]'
              }`}
            >
              {t.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${tab === t.id ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--color-secondary)] text-[var(--color-on-surface-variant)]'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {tab === 'refills' && (
          <div className="p-4 space-y-3">
            {pending.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--color-on-surface-variant)]">No pending refill requests.</p>
            ) : (
              pending.map((rx) => <RefillRow key={rx.id} rx={rx} />)
            )}
          </div>
        )}

        {tab !== 'refills' && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="border-b border-[var(--color-outline-variant)]">
                <tr>
                  <Th>Medication</Th><Th>Patient</Th><Th>Doctor</Th><Th>Dosage</Th><Th>Frequency</Th><Th>Status</Th><Th>Created</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]">
                {(tab === 'active' ? active : archived).length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-[var(--color-on-surface-variant)]">No prescriptions here.</td></tr>
                )}
                {(tab === 'active' ? active : archived).map((rx) => (
                  <tr key={rx.id} className="hover:bg-[var(--color-secondary)]/40">
                    <Td>{rx.medication_name}</Td>
                    <Td>{rx.patient_name || 'Patient'}</Td>
                    <Td>{rx.doctor_name || '—'}</Td>
                    <Td>{rx.dosage}</Td>
                    <Td>{rx.frequency}</Td>
                    <td className="px-4 py-3">{statusPill(rx.status, rx.refill_requested)}</td>
                    <Td>{rx.created_at ? new Date(rx.created_at).toLocaleDateString() : '—'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}