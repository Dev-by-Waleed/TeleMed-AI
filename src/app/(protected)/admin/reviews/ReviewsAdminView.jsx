"use client";

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { Star, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { deleteReviewAction } from '@/actions/admin';
import { fmtDateShort } from '@/lib/date';

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--color-outline)]'}`}
        />
      ))}
    </span>
  );
}

function DeleteReview({ review }) {
  const [state, formAction, isPending] = useActionState(deleteReviewAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success('Review removed!');
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);
  return (
    <form action={formAction}>
      <input type="hidden" name="review_id" value={review.id} />
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

export default function ReviewsAdminView({ reviews = [] }) {
  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Reviews</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">Moderate patient ratings and comments. Removing a review recalculates the doctor&apos;s rating.</p>
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px]">
            <thead className="border-b border-[var(--color-outline-variant)]">
              <tr>
                <Th>Patient</Th><Th>Doctor</Th><Th>Specialty</Th><Th>Rating</Th><Th>Comment</Th><Th>Date</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <ShieldAlert className="w-8 h-8 text-[var(--color-on-surface-variant)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-on-surface-variant)]">No reviews yet.</p>
                  </td>
                </tr>
              )}
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--color-secondary)]/40 align-top">
                  <td className="px-4 py-3 text-sm text-[var(--color-on-surface)]">{r.patient_name || 'Patient'}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-on-surface)]">{r.doctor_name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)]">{r.specialty || '—'}</td>
                  <td className="px-4 py-3"><Stars rating={r.rating} /></td>
                  <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] max-w-[340px] break-words whitespace-normal">{r.comment || '—'}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)] whitespace-nowrap">{fmtDateShort(r.created_at) || '—'}</td>
                  <td className="px-4 py-3"><DeleteReview review={r} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}