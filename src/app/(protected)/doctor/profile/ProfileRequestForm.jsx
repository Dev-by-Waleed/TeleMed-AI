"use client";

import { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { ClipboardPenLine, Loader2, Send, CheckCircle2, XCircle, Clock } from "lucide-react";
import { fmtDateShort } from "@/lib/date";
import { submitProfileRequestAction } from "@/actions/profile-requests";

const inputCls =
  "w-full h-11 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow";
const textareaCls =
  "w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow";

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-800", icon: Clock },
    approved: { label: "Approved", cls: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
    denied: { label: "Declined", cls: "bg-red-100 text-red-800", icon: XCircle },
  };
  const meta = map[status] || map.pending;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${meta.cls}`}>
      <Icon className="w-3.5 h-3.5" />
      {meta.label}
    </span>
  );
}

export default function ProfileRequestForm({ doctor, requests = [] }) {
  const [state, formAction, isPending] = useActionState(submitProfileRequestAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Request submitted. Your admin will review it shortly.");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const d = doctor || {};
  const open = requests.filter((r) => r.status === "pending");

  return (
    <section className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl shadow-sm">
      <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[var(--color-outline-variant)]">
        <div className="bg-[var(--color-secondary)] p-2 rounded-lg text-[var(--color-primary)]">
          <ClipboardPenLine className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--color-foreground)]">Request Profile Change</h2>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
            Your display name and specialty are managed by your administrator.
          </p>
        </div>
      </div>

      <div className="p-6">
      {requests.length > 0 && (
        <div className="mb-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Your requests</p>
          {requests.map((r) => {
            const changes = [
              r.requested_full_name ? `Name → ${r.requested_full_name}` : null,
              r.requested_specialty ? `Specialty → ${r.requested_specialty}` : null,
            ]
              .filter(Boolean)
              .join(", ");
            return (
              <div key={r.id} className="border border-[var(--color-outline-variant)] rounded-lg p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm font-semibold text-[var(--color-on-surface)]">
                    {changes}
                  </p>
                  <StatusBadge status={r.status} />
                </div>
                {r.reason && (
                  <p className="text-xs mt-2 text-[var(--color-on-surface-variant)]">
                    <span className="font-semibold">Reason: </span>
                    {r.reason}
                  </p>
                )}
                {r.admin_response && (
                  <p className="text-xs mt-1 text-[var(--color-on-surface-variant)]">
                    <span className="font-semibold">Admin: </span>
                    {r.admin_response}
                  </p>
                )}
                <p className="text-[11px] mt-2 text-[var(--color-on-surface-variant)]">
                  {fmtDateShort(r.created_at)}
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
            <Field label="New Display Name" htmlFor="reqFullName">
              <input
                id="reqFullName"
                name="full_name"
                type="text"
                placeholder={d.full_name || "Current name"}
                className={inputCls}
              />
            </Field>

            <Field label="New Specialty" htmlFor="reqSpecialty">
              <input
                id="reqSpecialty"
                name="specialty"
                type="text"
                placeholder={d.specialty || "Current specialty"}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Reason" htmlFor="reqReason">
            <textarea
              id="reqReason"
              name="reason"
              rows={3}
              required
              placeholder="Briefly explain why you need this change"
              className={textareaCls}
            />
          </Field>

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
      </div>
    </section>
  );
}
