'use client';

import React, { useEffect, useRef, useState } from 'react';
import createClient from '@/lib/supabase/client';
import {
  Send,
  Loader2,
  Video,
  ShieldAlert,
  Pill,
  FileText,
  User,
  HeartPulse,
  AlertTriangle,
} from 'lucide-react';

export default function ConsultationRoom({
  appointmentId,
  currentUserId,
  currentUserName,
  counterpartName,
  doctorSpecialty,
  reason,
  initialMessages = [],
  context,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const supabase = createClient();

  useEffect(() => {
    // Load-history + subscribe are one channel-bound flow on the messages table.
    const channel = supabase
      .channel(`appointment-${appointmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `appointment_id=eq.${appointmentId}`,
        },
        (payload) => {
          const msg = payload.new;
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, appointmentId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    const { error } = await supabase.from('messages').insert({
      appointment_id: appointmentId,
      sender_id: currentUserId,
      body,
    });
    setSending(false);
    if (!error) {
      setText('');
    } else {
      console.error('Send failed:', error.message);
    }
  }

  function initials(name) {
    return (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Left: Patient context panel */}
      <aside className="lg:w-[340px] shrink-0 border-r border-[var(--color-outline-variant)] bg-[var(--color-surface-card)] p-5 overflow-y-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {initials(counterpartName)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-on-surface)]">
              {counterpartName}
            </h3>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              {doctorSpecialty || 'Consultation'}{reason ? ` • ${reason}` : ''}
            </p>
          </div>
        </div>

        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-3 flex items-center gap-1.5">
          <HeartPulse className="w-4 h-4" /> Patient Profile
        </h4>

        <div className="space-y-4 text-xs">
          {context.age && (
            <Info label="Age / Gender">
              {context.age} yrs • {context.gender || '—'}
            </Info>
          )}
          {context.weight_kg && (
            <Info label="Weight / Height">{context.weight_kg} kg • {context.height_cm} cm</Info>
          )}
          {context.emergency_contact && (
            <Info label="Emergency Contact">{context.emergency_contact}</Info>
          )}

          <Section icon={AlertTriangle} title="Allergies">
            {context.allergies ? (
              <p className="text-[var(--color-on-surface)]">{context.allergies}</p>
            ) : (
              <p className="text-[var(--color-on-surface-variant)]">None reported</p>
            )}
          </Section>

          <Section icon={Pill} title="Current Medications">
            {context.medications ? (
              <p className="text-[var(--color-on-surface)]">{context.medications}</p>
            ) : (
              <p className="text-[var(--color-on-surface-variant)]">None</p>
            )}
          </Section>

          <Section icon={ShieldAlert} title="Pre-existing Conditions">
            {context.conditions ? (
              <p className="text-[var(--color-on-surface)]">{context.conditions}</p>
            ) : (
              <p className="text-[var(--color-on-surface-variant)]">None</p>
            )}
          </Section>

          {context.reports && context.reports.length > 0 && (
            <Section icon={FileText} title="Reports">
              <ul className="space-y-2">
                {context.reports.map((r) => (
                  <li key={r.id} className="rounded-lg border border-[var(--color-outline-variant)] p-2">
                    <p className="font-semibold text-[var(--color-on-surface)] truncate">{r.title}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] capitalize">
                      {r.status === 'analyzed' ? 'AI summary available' : r.status}
                    </p>
                    {r.ai_summary && (
                      <p className="text-[11px] text-[var(--color-on-surface)] mt-1">
                        {r.ai_summary}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </aside>

      {/* Right: Chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-4 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-card)] flex items-center gap-3">
          <Video className="w-5 h-5 text-[var(--color-primary)]" />
          <div>
            <h2 className="text-sm font-bold text-[var(--color-on-surface)]">Live Consultation</h2>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Real-time text chat</p>
          </div>
          <span className="ml-auto flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live
          </span>
        </header>

        <div ref={listRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--color-surface-bright)]">
        {messages.length === 0 && (
          <p className="text-center text-xs text-[var(--color-on-surface-variant)] pt-10">
            No messages yet. Say hello to start the consultation.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={`flex gap-3 ${mine ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${mine ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)]'}`}>
                {mine ? initials(currentUserName) : initials(counterpartName)}
              </div>
              <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${mine ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)]/60'}`}>
                <p className="text-sm leading-relaxed">{m.body}</p>
                <span className={`text-[10px] mt-1.5 block ${mine ? 'text-white/70' : 'text-[var(--color-on-surface-variant)]'}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-card)] flex items-end gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-on-surface)]"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="bg-[var(--color-primary)] text-white p-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}

function Info({ label, children }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">{label}</p>
      <p className="text-[var(--color-on-surface)] mt-0.5">{children}</p>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <h5 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h5>
      {children}
    </div>
  );
}
