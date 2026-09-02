"use client";

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { BellRing, Send, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import { broadcastNotificationAction } from '@/actions/admin';

function BroadcastForm() {
  const [state, formAction, isPending] = useActionState(broadcastNotificationAction, null);
  const formRef = React.useRef(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const inputClass =
    "w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-on-surface)]";

  return (
    <form ref={formRef} action={formAction} className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
      <h3 className="text-base font-semibold text-[var(--color-foreground)] flex items-center gap-2 mb-4">
        <BellRing className="w-4 h-4 text-[var(--color-primary)]" />
        Send Announcement
      </h3>

      {state?.error && <p role="alert" className="mb-4 text-sm text-red-600 font-medium">{state.error}</p>}
      {state?.success && (
        <p role="status" className="mb-4 text-sm font-medium inline-flex items-center gap-1.5" style={{ color: '#047857' }}>
          <CheckCircle2 className="w-4 h-4" />
          Sent to {state.count} {state.audience === 'all' ? 'active user' : state.audience + (state.count === 1 ? '' : 's')}.
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">Audience</label>
          <select name="audience" defaultValue="all" className={inputClass}>
            <option value="all">All active users</option>
            <option value="patients">Patients</option>
            <option value="doctors">Doctors</option>
            <option value="admins">Admins</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">Title</label>
          <input name="title" required placeholder="e.g. Scheduled maintenance" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">Message</label>
          <textarea name="body" rows={3} placeholder="Optional message body" className={inputClass + " resize-none"} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">Link (optional)</label>
          <input name="link" placeholder="e.g. /patient/dashboard" className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isPending ? 'Sending...' : 'Send Notification'}
        </button>
      </div>
    </form>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap">{children || '—'}</td>;
}

export default function NotificationsAdminView({ notifications = [] }) {
  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Notifications</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">Broadcast announcements to users and review system &amp; appointment notifications. Chat message alerts are moderated on the Messages page.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-4">
          <BroadcastForm />
        </section>

        <section className="lg:col-span-8">
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-outline-variant)]">
              <h2 className="text-base font-semibold text-[var(--color-foreground)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-on-surface-variant)]" />
                Recent notifications
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="border-b border-[var(--color-outline-variant)]">
                  <tr>
                    <Th>Recipient</Th><Th>Type</Th><Th>Title</Th><Th>Body</Th><Th>Read</Th><Th>Sent</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline-variant)]">
                  {notifications.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center">
                        <BellRing className="w-8 h-8 text-[var(--color-on-surface-variant)] mx-auto mb-3" />
                        <p className="text-sm text-[var(--color-on-surface-variant)]">No notifications sent yet.</p>
                      </td>
                    </tr>
                  )}
                  {notifications.map((n) => (
                    <tr key={n.id} className="hover:bg-[var(--color-secondary)]/40">
                      <Td>{n.recipient_name || n.user_id?.slice(0, 8)}</Td>
                      <Td>{n.type}</Td>
                      <Td>{n.title}</Td>
                      <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)] max-w-[280px] truncate">{n.body || '—'}</td>
                      <Td>{n.is_read ? 'Yes' : 'No'}</Td>
                      <Td>{n.created_at ? new Date(n.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}