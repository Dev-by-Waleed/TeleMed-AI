'use client';

import React, { useState } from 'react';
import { FileText, X, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fmtDateShort } from '@/lib/date';

function statusPill(value) {
  const colors = {
    uploaded: { color: '#b45309', bg: '#fef3c7' },
    analyzed: { color: '#047857', bg: '#d1fae5' },
    failed: { color: '#b91c1c', bg: '#fee2e2' },
  };
  const c = colors[value] || { color: 'var(--color-on-surface-variant)', bg: 'var(--color-surface-container-low)' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color: c.color, backgroundColor: c.bg }}>
      {value}
    </span>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap">{children || '—'}</td>;
}

export default function ReportsAdminView({ reports = [] }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Report Oversight</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">Review uploaded reports and their AI summaries.</p>
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-[var(--color-outline-variant)]">
              <tr>
                <Th>Patient</Th><Th>Title</Th><Th>Uploaded</Th><Th>Status</Th><Th>AI Summary</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <FileText className="w-8 h-8 text-[var(--color-on-surface-variant)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-on-surface-variant)]">No reports uploaded yet.</p>
                  </td>
                </tr>
              )}
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--color-secondary)]/40">
                  <Td>{r.patient_name}</Td>
                  <Td>{r.title}</Td>
                  <Td>{fmtDateShort(r.created_at) || '—'}</Td>
                  <td className="px-4 py-3">{statusPill(r.status)}</td>
                  <td className="px-4 py-3">
                    {r.ai_summary ? (
                      <button
                        type="button"
                        onClick={() => setSelected(r)}
                        className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                      >
                        View
                      </button>
                    ) : <span className="text-xs text-[var(--color-on-surface-variant)]">Pending analysis</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto" onClick={() => setSelected(null)}>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[var(--color-foreground)]">{selected.title}</h2>
              <button type="button" onClick={() => setSelected(null)} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">{selected.patient_name}</p>
            <div className="flex items-center gap-2 mb-4">
              {statusPill(selected.status)}
              {selected.file_url && (
                <a
                  href={selected.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Open file
                </a>
              )}
            </div>
            {selected.ai_summary ? (
              <div className="text-sm text-[var(--color-on-surface)] whitespace-pre-wrap bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-1 [&_strong]:font-semibold [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_h1,_h2,_h3]:mt-2 [&_h1,_h2,_h3]:mb-1 [&_p]:mb-2">
                <ReactMarkdown>{selected.ai_summary}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-on-surface-variant)]">AI analysis pending.</p>
            )}
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-4">Informational AI summary — not a substitute for professional medical advice.</p>
          </div>
        </div>
      )}
    </div>
  );
}
