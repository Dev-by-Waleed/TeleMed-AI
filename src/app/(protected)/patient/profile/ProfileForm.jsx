"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  UserRound,
  Mail,
  Activity,
  HeartPulse,
  Stethoscope,
  Zap,
  Ruler,
  Weight,
  Droplets,
} from "lucide-react";
import { updateProfileAction } from "@/actions/profile";
import { patientProfileSchema } from "@/lib/validations";
import AvatarUpload from "@/Components/account/AvatarUpload";
import ChangePasswordForm from "@/Components/account/ChangePasswordForm";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const inputCls =
  "w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow";
const textareaCls =
  "w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow";

function Field({ label, htmlFor, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl shadow-sm">
      <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[var(--color-outline-variant)]">
        <div className="bg-[var(--color-secondary)] p-2 rounded-lg text-[var(--color-primary)]">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--color-foreground)]">{title}</h2>
          {subtitle && (
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function ProfileForm({ profile, userEmail, fullName, avatarUrl }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const p = profile || {};

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(patientProfileSchema),
    mode: "onTouched",
    defaultValues: {
      age: p.age ?? "",
      gender: p.gender ?? "",
      height_cm: p.height_cm ?? "",
      weight_kg: p.weight_kg ?? "",
      blood_group: p.blood_group ?? "",
      allergies: p.allergies ?? "",
      medications: p.medications ?? "",
      conditions: p.conditions ?? "",
      emergency_contact: p.emergency_contact ?? "",
      notes: p.notes ?? "",
      past_surgeries: p.past_surgeries ?? "",
      smoking_status: p.smoking_status ?? "",
      chronic_illness_notes: p.chronic_illness_notes ?? "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Profile saved successfully.");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  function onSubmit(data) {
    const fd = new FormData();
    fd.set("age", String(data.age));
    fd.set("gender", data.gender === "other" ? "non-binary" : data.gender === "prefer_not_to_say" ? "prefer-not-to-say" : data.gender);
    fd.set("height", String(data.height_cm));
    fd.set("weight", String(data.weight_kg));
    fd.set("bloodGroup", data.blood_group ?? "");
    fd.set("allergies", data.allergies ?? "");
    fd.set("medications", data.medications ?? "");
    fd.set("conditions", data.conditions ?? "");
    fd.set("emergencyContact", data.emergency_contact);
    fd.set("notes", data.notes ?? "");
    fd.set("pastSurgeries", data.past_surgeries ?? "");
    fd.set("smokingStatus", data.smoking_status ?? "");
    fd.set("chronicIllnessNotes", data.chronic_illness_notes ?? "");
    startTransition(() => formAction(fd));
  }

  const statCards = [
    { icon: Zap, label: "Age", value: p.age ? `${p.age} yrs` : "—" },
    { icon: Ruler, label: "Height", value: p.height_cm ? `${p.height_cm} cm` : "—" },
    { icon: Weight, label: "Weight", value: p.weight_kg ? `${p.weight_kg} kg` : "—" },
    { icon: Droplets, label: "Blood Group", value: p.blood_group || "—" },
  ];

  return (
    <main className="flex-1 p-4 md:p-10 max-w-[1200px] mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
          My Profile
        </h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">
          Review and update your medical details. Changes are shared with your doctors before each
          consultation.
        </p>
      </header>

      {/* Identity card */}
      <div className="mb-8 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="shrink-0">
            <AvatarUpload avatarUrl={avatarUrl} fallbackText={fullName || userEmail || "U"} />
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold flex items-center gap-1.5">
              <UserRound className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="truncate">{fullName || "Patient"}</span>
            </p>
            <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-[var(--color-outline)]" />
              <span className="truncate">{userEmail}</span>
            </p>
          </div>
        </div>
        {p.blood_group && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-foreground)] text-xs font-semibold border border-[var(--color-outline-variant)]">
            <Droplets className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            {p.blood_group} blood
          </span>
        )}
      </div>

      {/* Overview stats */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-4 flex items-center gap-3"
          >
            <div className="bg-[var(--color-secondary)] p-2 rounded-lg text-[var(--color-primary)] shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide font-semibold text-[var(--color-on-surface-variant)]">
                {label}
              </p>
              <p className="text-sm font-semibold text-[var(--color-foreground)] truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {state?.error && (
        <div
          role="alert"
          className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Vitals */}
          <SectionCard
            icon={Activity}
            title="Basic Vitals"
            subtitle="Your core physical measurements and contact details."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Age" htmlFor="age" error={errors.age?.message}>
                <input
                  type="number"
                  id="age"
                  min="1"
                  max="150"
                  placeholder="e.g. 45"
                  {...register("age")}
                  className={inputCls}
                />
              </Field>

              <Field label="Gender" htmlFor="gender" error={errors.gender?.message}>
                <select id="gender" {...register("gender")} className={inputCls}>
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Non-binary</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </Field>

              <Field label="Height (cm)" htmlFor="height_cm" error={errors.height_cm?.message}>
                <input
                  type="number"
                  id="height_cm"
                  min="50"
                  max="250"
                  placeholder="e.g. 175"
                  {...register("height_cm")}
                  className={inputCls}
                />
              </Field>

              <Field label="Weight (kg)" htmlFor="weight_kg" error={errors.weight_kg?.message}>
                <input
                  type="number"
                  id="weight_kg"
                  min="2"
                  max="400"
                  placeholder="e.g. 70"
                  {...register("weight_kg")}
                  className={inputCls}
                />
              </Field>

              <Field label="Emergency Contact Number" htmlFor="emergency_contact" error={errors.emergency_contact?.message} className="md:col-span-2">
                <input
                  type="tel"
                  id="emergency_contact"
                  placeholder="e.g. +1 555 123 4567"
                  {...register("emergency_contact")}
                  className={inputCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* Optional Details */}
          <SectionCard
            icon={HeartPulse}
            title="Optional Details"
            subtitle="Additional context that helps your care team."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Blood Group" htmlFor="blood_group">
                <select id="blood_group" {...register("blood_group")} className={inputCls}>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </Field>

              <Field label="Smoking Status" htmlFor="smoking_status">
                <select id="smoking_status" {...register("smoking_status")} className={inputCls}>
                  <option value="">Select smoking status</option>
                  <option value="never">Never smoked</option>
                  <option value="former">Former smoker</option>
                  <option value="current">Current smoker</option>
                </select>
              </Field>
            </div>

            <div className="mt-6 space-y-6">
              <Field label="Past Surgeries" htmlFor="past_surgeries">
                <textarea
                  id="past_surgeries"
                  rows={2}
                  placeholder="List any past surgeries, if any"
                  {...register("past_surgeries")}
                  className={textareaCls}
                />
              </Field>

              <Field label="Chronic Illness Notes" htmlFor="chronic_illness_notes">
                <textarea
                  id="chronic_illness_notes"
                  rows={2}
                  placeholder="Additional notes about any chronic illnesses"
                  {...register("chronic_illness_notes")}
                  className={textareaCls}
                />
              </Field>

              <Field label="General Notes" htmlFor="notes">
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="Anything else you'd like to share"
                  {...register("notes")}
                  className={textareaCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* Medical History */}
          <SectionCard
            icon={Stethoscope}
            title="Medical History"
            subtitle="Important clinical details your doctors should know."
          >
            <div className="space-y-6">
              <Field label="Allergies" htmlFor="allergies">
                <textarea
                  id="allergies"
                  rows={2}
                  placeholder="List any known allergies (e.g., Penicillin, Peanuts) or type 'None'"
                  {...register("allergies")}
                  className={textareaCls}
                />
              </Field>

              <Field label="Current Medications" htmlFor="medications">
                <textarea
                  id="medications"
                  rows={2}
                  placeholder="List current medications and dosages or type 'None'"
                  {...register("medications")}
                  className={textareaCls}
                />
              </Field>

              <Field label="Pre-existing Conditions" htmlFor="conditions">
                <textarea
                  id="conditions"
                  rows={3}
                  placeholder="Briefly describe any chronic conditions (e.g., Asthma, Hypertension)"
                  {...register("conditions")}
                  className={textareaCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <a
              href="/patient/dashboard"
              className="px-6 py-3 rounded-lg text-sm font-semibold border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        <ChangePasswordForm />
      </div>
    </main>
  );
}
