'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, CalendarDays, Clock, CheckCircle2 } from 'lucide-react';
import { bookAppointmentAction } from '@/actions/appointments';

function nextNDays(n, startOffset = 1) {
  const days = [];
  for (let i = startOffset; i < startOffset + n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function timeSlotsFor(date) {
  const slots = [];
  for (let h = 9; h <= 17; h++) {
    const d = new Date(date);
    d.setHours(h, 0, 0, 0);
    // Skip past times for today
    if (d.getTime() > Date.now()) {
      slots.push(d);
    }
  }
  return slots;
}

function fmtDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function BookingForm({ doctors }) {
  const [state, formAction, isPending] = useActionState(bookAppointmentAction, null);
  const router = useRouter();
  const [doctorId, setDoctorId] = React.useState('');
  const [day, setDay] = React.useState(null);
  const [time, setTime] = React.useState(null);
  const [reason, setReason] = React.useState('');

  const days = React.useMemo(() => nextNDays(7), []);
  const slots = React.useMemo(() => (day ? timeSlotsFor(day) : []), [day]);

  useEffect(() => {
    if (state?.success) {
      router.push('/patient/dashboard');
      router.refresh();
    }
  }, [state, router]);

  const selectedDate = day && time ? new Date(time) : null;
  const canSubmit = !!doctorId && !!selectedDate;

  return (
    <main className="w-full min-h-screen flex items-start justify-center p-4 md:p-10 bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="w-full max-w-3xl bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 md:p-10 shadow-md">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-primary-dark)] mb-1">
          Book an Appointment
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-8">
          Choose a doctor and an available time slot for your consultation.
        </p>

        {state?.error && (
          <div role="alert" className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-8">
          {/* Step 1: Choose doctor */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-3">
              1. Select a Doctor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctors.map((doc) => (
                <label
                  key={doc.id}
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
                    doctorId === doc.id
                      ? 'border-[var(--color-primary)] bg-[var(--color-secondary)]/50'
                      : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="doctorId"
                    value={doc.id}
                    checked={doctorId === doc.id}
                    onChange={() => setDoctorId(doc.id)}
                    className="accent-[var(--color-primary)]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--color-on-surface)]">{doc.full_name}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">
                      {doc.specialty} • {doc.rating} ({doc.reviews_count})
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Step 2: Choose date */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> 2. Select a Day
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {days.map((d) => {
                const iso = d.toISOString().split('T')[0];
                const isSel = day && day.toISOString().split('T')[0] === iso;
                return (
                  <button
                    type="button"
                    key={iso}
                    onClick={() => { setDay(d); setTime(null); }}
                    className={`rounded-lg border p-2 text-center transition-colors ${
                      isSel
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                        : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <span className="block text-[10px] uppercase opacity-80">{fmtDate(d).split(',')[0]}</span>
                    <span className="block text-xs font-semibold mt-0.5">
                      {d.getMonth() + 1}/{d.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 3: Choose time */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> 3. Select a Time
            </h2>
            {slots.length === 0 ? (
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                {day ? 'No time slots available for this day.' : 'Please select a day first.'}
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((s) => {
                  const isSel = time && new Date(time).getTime() === s.getTime();
                  return (
                    <button
                      type="button"
                      key={s.getTime()}
                      onClick={() => setTime(s.toISOString())}
                      className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                        isSel
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[var(--color-primary)]/50'
                      }`}
                    >
                      {fmtTime(s)}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Step 4: Reason (optional) */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-3">
              4. Reason (optional)
            </h2>
            <textarea
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Briefly describe why you'd like to see the doctor"
              className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
            />
          </section>

          {/* Hidden scheduled time */}
          {selectedDate && (
            <input type="hidden" name="scheduledAt" value={selectedDate.toISOString()} />
          )}

          {/* Summary */}
          <section className="rounded-lg bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">
              Appointment Summary
            </h3>
            {!canSubmit ? (
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                Complete all steps to see your summary.
              </p>
            ) : (
              <div className="flex items-center gap-3 text-sm text-[var(--color-on-surface)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="font-semibold">
                  {doctors.find((d) => d.id === doctorId)?.full_name}
                </span>
                <span className="text-[var(--color-on-surface-variant)]">
                  • {fmtDate(selectedDate)} at {fmtTime(selectedDate)} ({selectedDate.toLocaleTimeString([], { hour: 'numeric' })} slot)
                </span>
              </div>
            )}
          </section>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || !canSubmit}
              className="bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Booking...
                </>
              ) : (
                <>
                  Confirm Booking <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
