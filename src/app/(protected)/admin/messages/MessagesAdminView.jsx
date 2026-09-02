"use client";

import React, { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { MessageSquare, Trash2, Loader2, ShieldAlert, User, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { deleteMessageAction } from '@/actions/admin';
import { fmtDateTime } from '@/lib/date';

function RemoveMessage({ message }) {
  const [state, formAction, isPending] = useActionState(deleteMessageAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success('Message removed!');
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);
  return (
    <form action={formAction}>
      <input type="hidden" name="message_id" value={message.id} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#b91c1c] hover:bg-[#991b1b] disabled:opacity-50 transition-colors"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        Remove
      </button>
      {state?.error && <span className="block mt-1 text-xs text-red-600">{state.error}</span>}
    </form>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap ${className}`}>{children || '—'}</td>;
}

function SenderBadge({ role }) {
  const isPatient = role === 'patient';
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={
        isPatient
          ? { color: '#1d4ed8', backgroundColor: '#dbeafe' }
          : { color: '#047857', backgroundColor: '#d1fae5' }
      }
    >
      {isPatient ? <User className="w-3 h-3" /> : <Stethoscope className="w-3 h-3" />}
      {isPatient ? 'Patient' : 'Doctor'}
    </span>
  );
}

export default function MessagesAdminView({ messages = [] }) {
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = roleFilter === 'all' ? messages : messages.filter((m) => m.sender_role === roleFilter);
  const patientCount = messages.filter((m) => m.sender_role === 'patient').length;
  const doctorCount = messages.filter((m) => m.sender_role === 'doctor').length;

  const filters = [
    { id: 'all', label: `All (${messages.length})` },
    { id: 'patient', label: `From patients (${patientCount})` },
    { id: 'doctor', label: `From doctors (${doctorCount})` },
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Messages</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">Moderate consultation chat messages. Removing a message deletes it for both participants.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setRoleFilter(f.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              roleFilter === f.id
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-foreground)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead className="border-b border-[var(--color-outline-variant)]">
              <tr>
                <Th>Sent by</Th><Th>Role</Th><Th>Conversation</Th><Th>Message</Th><Th>Sent</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <MessageSquare className="w-8 h-8 text-[var(--color-on-surface-variant)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-on-surface-variant)]">No messages match this filter.</p>
                  </td>
                </tr>
              )}
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--color-secondary)]/40 align-top">
                  <Td>{m.sender_name || 'Unknown'}</Td>
                  <td className="px-4 py-3"><SenderBadge role={m.sender_role} /></td>
                  <Td className="max-w-[260px] truncate">
                    {m.patient_name || m.doctor_name
                      ? `${m.patient_name || 'Patient'} ↔ ${m.doctor_name || 'Doctor'}${m.specialty ? ` · ${m.specialty}` : ''}`
                      : 'Unlinked chat'}
                  </Td>
                  <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] max-w-[380px] break-words whitespace-normal">{m.body}</td>
                  <Td>{fmtDateTime(m.created_at) || '—'}</Td>
                  <td className="px-4 py-3"><RemoveMessage message={m} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-[var(--color-on-surface-variant)] inline-flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5" />
        Message removals also delete the corresponding row from the live consultation room on both sides.
      </p>
    </div>
  );
}