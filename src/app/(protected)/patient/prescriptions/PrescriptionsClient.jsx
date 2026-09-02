"use client";

import React, { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pill, RefreshCcw, CheckCircle2, Loader2, Stethoscope } from "lucide-react";
import { requestRefillAction } from "@/actions/prescriptions";

function StatusBadge({ status, refillRequested }) {
  const base = "text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded";
  if (refillRequested) return <span className={`${base} bg-blue-500/15 text-blue-700 dark:text-blue-400`}>Refill requested</span>;
  if (status === "active") return <span className={`${base} bg-green-500/15 text-green-700 dark:text-green-400`}>Active</span>;
  if (status === "completed") return <span className={`${base} bg-slate-500/15 text-slate-600 dark:text-slate-400`}>Completed</span>;
  return <span className={`${base} bg-red-500/15 text-red-600 dark:text-red-400`}>Discontinued</span>;
}

function RefillButton({ prescriptionId }) {
  const [state, formAction, isPending] = useActionState(requestRefillAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="prescriptionId" value={prescriptionId} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCcw className="w-3.5 h-3.5" />}
        Request Refill
      </button>
    </form>
  );
}

function PrescriptionCard({ p }) {
  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-5 flex gap-4 items-start relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]" />
      <div className="w-11 h-11 rounded-full bg-[var(--color-secondary)] flex items-center justify-center shrink-0 ml-1">
        <Pill className="w-5 h-5 text-[var(--color-primary)]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-foreground)]">
              {p.medication_name}
            </h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
              {p.dosage} &middot; {p.frequency}
            </p>
          </div>
          <StatusBadge status={p.status} refillRequested={p.refill_requested} />
        </div>

        {p.instructions && (
          <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">{p.instructions}</p>
        )}

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          {p.doctor?.full_name && (
            <span className="text-[11px] text-[var(--color-on-surface-variant)] inline-flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-[var(--color-outline)]" />
              {p.doctor.full_name}
            </span>
          )}
          {p.status === "active" && !p.refill_requested && <RefillButton prescriptionId={p.id} />}
          {p.status === "active" && p.refill_requested && (
            <span className="text-[11px] text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sent to your doctor &middot; {new Date(p.refill_requested_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PrescriptionsClient({ prescriptions }) {
  const active = prescriptions.filter((p) => p.status === "active");
  const archived = prescriptions.filter((p) => p.status !== "active");

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
      <main className="p-8 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
            Medications &amp; Refills
          </h1>
          <p className="text-base text-[var(--color-on-surface-variant)]">
            View your prescriptions and request refills. Requests are sent to
            your prescribing doctor.
          </p>
        </div>

        {prescriptions.length === 0 ? (
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-12 text-center">
            <Pill className="w-10 h-10 text-[var(--color-outline)] mx-auto mb-3" />
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              No prescriptions have been added yet. Your doctor will add them
              after a consultation.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            <section>
              <h2 className="text-base font-semibold text-[var(--color-foreground)] mb-4">
                Active
              </h2>
              {active.length === 0 ? (
                <p className="text-sm text-[var(--color-on-surface-variant)]">No active medications.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {active.map((p) => <PrescriptionCard key={p.id} p={p} />)}
                </div>
              )}
            </section>
            {archived.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-[var(--color-foreground)] mb-4">
                  Completed / Discontinued
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {archived.map((p) => <PrescriptionCard key={p.id} p={p} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}