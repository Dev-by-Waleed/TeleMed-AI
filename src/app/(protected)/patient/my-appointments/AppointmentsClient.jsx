"use client";

import React, { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CalendarDays,
  Video,
  XCircle,
  Loader2,
  ChevronRight,
  FileText,
  Star,
  X,
  Save,
} from "lucide-react";
import { cancelAppointmentAction, rescheduleAppointmentAction } from "@/actions/appointments";
import { submitReviewAction } from "@/actions/reviews";
import { fmtDate, fmtTime, fmtEnd, fmtRelative } from "@/lib/date";
import { toast } from "sonner";

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    completed: "bg-green-500/15 text-green-700 dark:text-green-400",
    cancelled: "bg-red-500/15 text-red-600 dark:text-red-400",
  };
  return (
    <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

function CancelButton({ appointmentId }) {
  const [state, formAction, isPending] = useActionState(cancelAppointmentAction, null);
  const router = useRouter();

  // Refresh the page after a successful cancellation
  React.useEffect(() => {
    if (state?.success) {
      toast.success("Appointment cancelled.");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(e) => {
          if (!window.confirm("Cancel this appointment?")) e.preventDefault();
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        Cancel
      </button>
    </form>
  );
}

function RescheduleButton({ appointmentId }) {
  const [state, formAction, isPending] = useActionState(rescheduleAppointmentAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success("Appointment cancelled. Pick a new slot.");
      router.push(state.redirectTo || "/patient/appointments");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(e) => {
          if (!window.confirm("Reschedule this appointment? The current slot will be cancelled and you can pick a new time.")) e.preventDefault();
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] disabled:opacity-50 transition-colors px-2 py-1 rounded hover:bg-[var(--color-secondary)]"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CalendarDays className="w-3.5 h-3.5" />
        )}
        Reschedule
      </button>
    </form>
  );
}

function ReviewModal({ appointment, onClose }) {
  const [state, formAction, isPending] = useActionState(submitReviewAction, null);
  const [rating, setRating] = React.useState(5);
  const [hover, setHover] = React.useState(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success("Review submitted. Thank you!");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border shadow-xl p-6 bg-[var(--color-surface-card)] border-[var(--color-outline-variant)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[var(--color-foreground)] flex items-center gap-2">
              <Star className="w-4 h-4 text-[var(--color-primary)]" />
              Rate your visit
            </h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              {appointment.doctor?.full_name || "Doctor"} &middot; {fmtDate(appointment.scheduled_at)}
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-foreground)] transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {state?.error && (
          <div role="alert" className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div role="status" className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 text-sm font-medium text-center">
            Thanks! Your review has been submitted.
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="appointmentId" value={appointment.id} />
          <input type="hidden" name="rating" value={rating} />

          <div className="flex items-center gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(null)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${(hover ?? rating) >= n ? "fill-amber-400 text-amber-400" : "text-[var(--color-outline)]"}`}
                />
              </button>
            ))}
          </div>

          <textarea
            name="comment"
            rows={3}
            placeholder="How was your experience? (optional)"
            className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 text-sm resize-none outline-none input-glow"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment: a, reviewMap }) {
  const [showReview, setShowReview] = React.useState(false);
  const doctorName = a.doctor?.full_name || "Doctor";
  const specialty  = a.doctor?.specialty || "General Practice";
  const myRating = reviewMap[a.id];

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-5 flex gap-4 items-start relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-tertiary)]" />

      <div className="w-11 h-11 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-sm shrink-0 ml-1">
        {doctorName.substring(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-foreground)] leading-tight">
              {doctorName}
            </h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 capitalize">
              {specialty}
            </p>
          </div>
          <StatusBadge status={a.status} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-on-surface-variant)]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-[var(--color-outline)]" />
            {fmtRelative(a.scheduled_at)} &middot; {fmtDate(a.scheduled_at)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[var(--color-outline)]" />
            {fmtTime(a.scheduled_at)} – {fmtEnd(a.scheduled_at, a.duration_min)}
          </span>
        </div>

        {a.reason && (
          <p className="mt-2 text-xs text-[var(--color-on-surface-variant)] line-clamp-2">
            {a.reason}
          </p>
        )}

        {(a.status === "completed" || a.status === "cancelled") && (
          <div className="mt-3 rounded-lg bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Doctor&apos;s Summary
            </p>
            {a.consultation_notes ? (
              <p className="text-xs text-[var(--color-on-surface)] whitespace-pre-line line-clamp-4">
                {a.consultation_notes}
              </p>
            ) : (
              <p className="text-xs text-[var(--color-on-surface-variant)] italic">
                No summary added yet.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {a.status === "pending" || a.status === "confirmed" ? (
            <>
              <a
                href={`/patient/consultation/${a.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-3 py-1.5 rounded-lg transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                Join Chat
              </a>
              <CancelButton appointmentId={a.id} />
              <RescheduleButton appointmentId={a.id} />
            </>
          ) : a.status === "completed" ? (
            <>
              <a
                href={`/patient/consultation/${a.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
              >
                View Consultation
                <ChevronRight className="w-3 h-3" />
              </a>

              {!myRating ? (
                <button
                  type="button"
                  onClick={() => setShowReview(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-secondary)] text-[var(--color-primary-dark)] hover:bg-[var(--color-secondary)]/70 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Star className="w-3.5 h-3.5" />
                  Rate this visit
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Rated {myRating}/5
                </span>
              )}

              {showReview && <ReviewModal appointment={a} onClose={() => setShowReview(false)} />}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsClient({ appointments, reviewMap }) {
  const upcoming = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );
  const past = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled"
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
      <main className="p-8 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
                My Appointments
              </h1>
              <p className="text-base text-[var(--color-on-surface-variant)]">
                View and manage your upcoming and past consultations.
              </p>
            </div>
            <a
              href="/patient/appointments"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
            >
              + Book New
            </a>
          </div>
        </div>

        <div className="space-y-10">
          {/* Upcoming */}
          <section>
            <h2 className="text-base font-semibold text-[var(--color-foreground)] mb-4">
              Upcoming {upcoming.length > 0 && <span className="text-[var(--color-on-surface-variant)] font-normal text-sm">({upcoming.length})</span>}
            </h2>
            {upcoming.length === 0 ? (
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-10 text-center">
                <p className="text-sm text-[var(--color-on-surface-variant)]">
                  No upcoming appointments.
                </p>
                <a
                  href="/patient/appointments"
                  className="mt-4 inline-block text-sm font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Book an appointment
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcoming.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} reviewMap={reviewMap} />
                ))}
              </div>
            )}
          </section>

          {/* Past / Cancelled */}
          <section>
            <h2 className="text-base font-semibold text-[var(--color-foreground)] mb-4">
              Past {past.length > 0 && <span className="text-[var(--color-on-surface-variant)] font-normal text-sm">({past.length})</span>}
            </h2>
            {past.length === 0 ? (
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-10 text-center">
                <p className="text-sm text-[var(--color-on-surface-variant)]">
                  No past consultations yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {past.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} reviewMap={reviewMap} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}