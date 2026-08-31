'use client';

import React, { useState } from 'react';
import { Video, MessageSquare, X } from 'lucide-react';

function statusPill(value) {
  const colors = {
    scheduled: { color: '#b45309', bg: '#fef3c7' },
    in_progress: { color: '#0e7490', bg: '#cffafe' },
    completed: { color: '#047857', bg: '#d1fae5' },
    cancelled: { color: '#b91c1c', bg: '#fee2e2' },
  };
  const c = colors[value] || { color: 'var(--color-on-surface-variant)', bg: 'var(--color-surface-container-low)' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color: c.color, backgroundColor: c.bg }}>
      {value.replace('_', ' ')}
    </span>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap">{children || '—'}</td>;
}

export default function ConsultationsAdminView({ consultations = [] }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Consultations</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">Oversight of all consultations across the platform.</p>
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="border-b border-[var(--color-outline-variant)]">
              <tr>
                <Th>Type</Th><Th>Patient</Th><Th>Doctor</Th><Th>Specialty</Th><Th>Scheduled</Th><Th>Status</Th><Th>Summary</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {consultations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--color-on-surface-variant)]">No consultations yet.</td>
                </tr>
              )}
              {consultations.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--color-secondary)]/40">
                  <td className="px-4 py-3">
                    {c.type === 'video'
                      ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface-variant)]"><Video className="w-3.5 h-3.5" /> Video</span>
                      : <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface-variant)]"><MessageSquare className="w-3.5 h-3.5" /> Chat</span>}
                  </td>
                  <Td>{c.patient_name}</Td>
                  <Td>{c.doctor_name}</Td>
                  <Td>{c.specialty}</Td>
                  <Td>{c.scheduled_at ? new Date(c.scheduled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}</Td>
                  <td className="px-4 py-3">{statusPill(c.status)}</td>
                  <td className="px-4 py-3">
                    {c.summary ? (
                      <button
                        type="button"
                        onClick={() => setSelected(c)}
                        className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                      >
                        View
                      </button>
                    ) : <span className="text-xs text-[var(--color-on-surface-variant)]">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected?.summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl max-w-lg w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Consultation Summary</h2>
              <button type="button" onClick={() => setSelected(null)} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
              {selected.patient_name} · {selected.doctor_name} · {selected.specialty}
            </p>
            <p className="text-sm text-[var(--color-on-surface)] whitespace-pre-wrap bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-4">
              {selected.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
