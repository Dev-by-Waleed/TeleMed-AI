"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pill, Plus, Square, Loader2, Stethoscope, RefreshCcw } from "lucide-react";
import { createPrescriptionAction, discontinuePrescriptionAction } from "@/actions/doctor-prescriptions";
import { prescriptionSchema } from "@/lib/validations";
import { fmtDateShort } from "@/lib/date";

function StatusBadge({ status, refillRequested }) {
  const base = "text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded";
  if (refillRequested) return <span className={`${base} bg-blue-500/15 text-blue-700 dark:text-blue-400`}>Refill requested</span>;
  if (status === "active") return <span className={`${base} bg-green-500/15 text-green-700 dark:text-green-400`}>Active</span>;
  if (status === "completed") return <span className={`${base} bg-slate-500/15 text-slate-600 dark:text-slate-400`}>Completed</span>;
  return <span className={`${base} bg-red-500/15 text-red-600 dark:text-red-400`}>Discontinued</span>;
}

function NewPrescriptionForm({ patients }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(prescriptionSchema),
    mode: "onTouched",
    defaultValues: {
      patient_id: "",
      medication_name: "",
      dosage: "",
      frequency: "",
      instructions: "",
    },
  });
  const [busy, setBusy] = useState(false);

  async function onSubmit(data) {
    setBusy(true);
    const fd = new FormData();
    fd.set("patientId", data.patient_id);
    fd.set("medicationName", data.medication_name);
    fd.set("dosage", data.dosage);
    fd.set("frequency", data.frequency);
    fd.set("instructions", data.instructions ?? "");
    const result = await createPrescriptionAction(null, fd);
    setBusy(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      reset();
      toast.success("Prescription saved.");
      startTransition(() => router.refresh());
    }
  }

  const inputClass =
    "w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-on-surface)]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
      <h3 className="text-base font-semibold text-[var(--color-foreground)] flex items-center gap-2 mb-4">
        <Plus className="w-4 h-4 text-[var(--color-primary)]" />
        New Prescription
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Patient</span>
          <select {...register("patient_id")} className={inputClass + " mt-1"}>
            <option value="">Select patient…</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.patient_name}</option>
            ))}
          </select>
          {errors.patient_id && <p className="text-xs text-red-500 mt-1">{errors.patient_id.message}</p>}
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Medication</span>
          <input
            type="text"
            {...register("medication_name")}
            placeholder="e.g. Amoxicillin"
            className={inputClass + " mt-1"}
          />
          {errors.medication_name && <p className="text-xs text-red-500 mt-1">{errors.medication_name.message}</p>}
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Dosage</span>
          <input
            type="text"
            {...register("dosage")}
            placeholder="e.g. 500 mg"
            className={inputClass + " mt-1"}
          />
          {errors.dosage && <p className="text-xs text-red-500 mt-1">{errors.dosage.message}</p>}
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Frequency</span>
          <input
            type="text"
            {...register("frequency")}
            placeholder="e.g. twice daily"
            className={inputClass + " mt-1"}
          />
          {errors.frequency && <p className="text-xs text-red-500 mt-1">{errors.frequency.message}</p>}
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Instructions (optional)</span>
          <textarea
            {...register("instructions")}
            rows={2}
            placeholder="e.g. Take with food"
            className={inputClass + " mt-1 resize-none"}
          />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-sm font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pill className="w-4 h-4" />}
          Save Prescription
        </button>
      </div>
    </form>
  );
}

function PrescriptionCard({ p }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  async function discontinue() {
    setBusy(true);
    const fd = new FormData();
    fd.set("prescriptionId", p.id);
    const result = await discontinuePrescriptionAction(null, fd);
    setBusy(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Prescription discontinued.");
      startTransition(() => router.refresh());
    }
  }

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-5 flex gap-4 items-start relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]" />
      <div className="w-11 h-11 rounded-full bg-[var(--color-secondary)] flex items-center justify-center shrink-0 ml-1">
        <Pill className="w-5 h-5 text-[var(--color-primary)]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-foreground)]">{p.medication_name}</h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
              {p.dosage} &middot; {p.frequency}
            </p>
          </div>
          <StatusBadge status={p.status} refillRequested={p.refill_requested} />
        </div>

        {p.instructions && <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">{p.instructions}</p>}

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] text-[var(--color-on-surface-variant)] inline-flex items-center gap-1">
            <Stethoscope className="w-3 h-3 text-[var(--color-outline)]" />
            {p.patient_name}
          </span>
          {p.status === "active" && !p.refill_requested && (
            <button
              type="button"
              disabled={busy}
              onClick={discontinue}
              className="inline-flex items-center gap-1.5 text-xs font-semibold border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:text-red-600 dark:hover:text-red-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
              Discontinue
            </button>
          )}
          {p.status === "active" && p.refill_requested && (
            <span className="text-[11px] text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
              <RefreshCcw className="w-3.5 h-3.5" />
              Refill requested &middot; {fmtDateShort(p.refill_requested_at)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DoctorPrescriptions({ prescriptions = [], patients = [] }) {
  const active = prescriptions.filter((p) => p.status === "active");
  const archived = prescriptions.filter((p) => p.status !== "active");

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
      <main className="p-8 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
            Prescriptions
          </h1>
          <p className="text-base text-[var(--color-on-surface-variant)]">
            Write and manage medications for your patients.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-5">
            <NewPrescriptionForm patients={patients} />
          </section>

          <section className="lg:col-span-7 space-y-10">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-foreground)] mb-4">Active</h2>
              {active.length === 0 ? (
                <p className="text-sm text-[var(--color-on-surface-variant)]">No active prescriptions.</p>
              ) : (
                <div className="space-y-4">
                  {active.map((p) => <PrescriptionCard key={p.id} p={p} />)}
                </div>
              )}
            </div>

            {archived.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-[var(--color-foreground)] mb-4">
                  Completed / Discontinued
                </h2>
                <div className="space-y-4">
                  {archived.map((p) => <PrescriptionCard key={p.id} p={p} />)}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}