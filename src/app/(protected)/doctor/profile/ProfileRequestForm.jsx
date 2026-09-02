"use client";

import { useActionState } from "react";
import { ClipboardPenLine, Loader2, Send, CheckCircle2, XCircle, Clock } from "lucide-react";
import { submitProfileRequestAction } from "@/actions/profile-requests";

const STATUS_META = {
  pending: { label: "Pending", bg: "#fef3c7", color: "#b45309", icon: Clock },
  approved: { label: "Approved", bg: "#d1fae5", color: "#047857", icon: CheckCircle2 },
  denied: { label: "Declined", bg: "#fee2e2", color: "#b91c1c", icon: XCircle },
};

export default function ProfileRequestForm({ doctor, requests = [] }) {
  const [state, formAction, isPending] = useActionState(submitProfileRequestAction, null);

  const d = doctor || {};
  const open = requests.filter((r) => r.status === "pending");

  return (
    <section className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 mt-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-2">
        <ClipboardPenLine className="w-4 h-4 text-[var(--color-primary)]" />
        Request Profile Change
      </h2>
      <p className="text-xs mt-1 mb-6" style={{ color: "var(--color-on-surface-variant)" }}>
        Your display name and specialty are managed by your administrator. Submit a request and they&apos;ll review it.
      </p>

      {requests.length > 0 && (
        <div className="mb-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Your requests</p>
          {requests.map((r) => {
            const meta = STATUS_META[r.status] || STATUS_META.pending;
            const Icon = meta.icon;
            const changes = [
              r.requested_full_name ? `Name → ${r.requested_full_name}` : null,
              r.requested_specialty ? `Specialty → ${r.requested_specialty}` : null,
            ]
              .filter(Boolean)
              .join(", ");
            return (
              <div key={r.id} className="border border-[var(--color-outline-variant)] rounded-lg p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
                    {changes}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {meta.label}
                  </span>
                </div>
                {r.reason && (
                  <p className="text-xs mt-2" style={{ color: "var(--color-on-surface-variant)" }}>
                    <span className="font-semibold">Reason: </span>
                    {r.reason}
                  </p>
                )}
                {r.admin_response && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                    <span className="font-semibold">Admin: </span>
                    {r.admin_response}
                  </p>
                )}
                <p className="text-[11px] mt-2" style={{ color: "var(--color-on-surface-variant)" }}>
                  {new Date(r.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {open.length > 0 ? (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 text-sm font-medium">
          You already have a pending request. Wait for your administrator to review it before submitting another.
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div role="alert" className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div role="status" className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 text-sm font-medium">
              Request submitted. Your admin will review it shortly.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="reqFullName">
                New Display Name
              </label>
              <input
                id="reqFullName"
                name="full_name"
                type="text"
                placeholder={d.full_name || "Current name"}
                className="w-full h-11 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="reqSpecialty">
                New Specialty
              </label>
              <input
                id="reqSpecialty"
                name="specialty"
                type="text"
                placeholder={d.specialty || "Current specialty"}
                className="w-full h-11 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="reqReason">
              Reason
            </label>
            <textarea
              id="reqReason"
              name="reason"
              rows={3}
              required
              placeholder="Briefly explain why you need this change"
              className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-5 py-2.5 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Request
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
