"use client";

import React, { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Pill,
  ShieldCheck,
  Save,
  Loader2,
  UserRound,
  Mail,
} from "lucide-react";
import { updateProfileAction } from "@/actions/profile";
import AvatarUpload from "@/Components/account/AvatarUpload";
import ChangePasswordForm from "@/Components/account/ChangePasswordForm";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ProfileForm({ profile, userEmail, fullName, avatarUrl }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  const p = profile || {};

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="p-10 px-4 md:px-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
            My Profile
          </h1>
          <p className="text-base text-[var(--color-on-surface-variant)]">
            Review and update your medical details. Changes are shared with your
            doctors before each consultation.
          </p>

          <div className="mt-6 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-5 flex flex-wrap items-center gap-x-8 gap-y-2">
            <AvatarUpload avatarUrl={avatarUrl} fallbackText={fullName || userEmail || "U"} />
            <div>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <UserRound className="w-4 h-4 text-[var(--color-primary)]" />
                {fullName || "Patient"}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[var(--color-outline)]" />
                {userEmail}
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[var(--color-secondary)] text-[var(--color-foreground)]">
              {p.blood_group ? `${p.blood_group} blood` : "Blood group not set"}
            </span>
          </div>
        </div>

        {state?.error && (
          <div
            role="alert"
            className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center"
          >
            {state.error}
          </div>
        )}

        {state?.success && (
          <div
            role="status"
            className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 text-sm font-medium text-center"
          >
            Profile saved successfully.
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* Basic Vitals */}
          <section className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-6">
              Basic Vitals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="age">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="1"
                  max="150"
                  defaultValue={p.age ?? ""}
                  required
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  defaultValue={p.gender ?? ""}
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="height">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="50"
                  max="250"
                  defaultValue={p.height_cm ?? ""}
                  required
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="weight">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="2"
                  max="400"
                  defaultValue={p.weight_kg ?? ""}
                  required
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="emergencyContact">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  placeholder="e.g. +1 555 123 4567"
                  defaultValue={p.emergency_contact ?? ""}
                  required
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
                />
              </div>
            </div>
          </section>

          {/* Optional Details */}
          <section className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-6">
              Optional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="bloodGroup">
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  defaultValue={p.blood_group ?? ""}
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="smokingStatus">
                  Smoking Status
                </label>
                <select
                  id="smokingStatus"
                  name="smokingStatus"
                  defaultValue={p.smoking_status ?? ""}
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
                >
                  <option value="">Select smoking status</option>
                  <option value="never">Never smoked</option>
                  <option value="former">Former smoker</option>
                  <option value="current">Current smoker</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-6">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="pastSurgeries">
                Past Surgeries
              </label>
              <textarea
                id="pastSurgeries"
                name="pastSurgeries"
                rows={2}
                placeholder="List any past surgeries, if any"
                defaultValue={p.past_surgeries ?? ""}
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
              />
            </div>

            <div className="flex flex-col gap-1 mt-6">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="chronicIllnessNotes">
                Chronic Illness Notes
              </label>
              <textarea
                id="chronicIllnessNotes"
                name="chronicIllnessNotes"
                rows={2}
                placeholder="Additional notes about any chronic illnesses"
                defaultValue={p.chronic_illness_notes ?? ""}
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
              />
            </div>

            <div className="flex flex-col gap-1 mt-6">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="notes">
                General Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Anything else you'd like to share"
                defaultValue={p.notes ?? ""}
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
              />
            </div>
          </section>

          {/* Medical History */}
          <section className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-6">
              Medical History
            </h2>
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)] flex items-center gap-2" htmlFor="allergies">
                  <AlertTriangle className="w-4 h-4 text-[var(--color-outline)]" />
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  rows={2}
                  placeholder="List any known allergies (e.g., Penicillin, Peanuts) or type 'None'"
                  defaultValue={p.allergies ?? ""}
                  className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)] flex items-center gap-2" htmlFor="medications">
                  <Pill className="w-4 h-4 text-[var(--color-outline)]" />
                  Current Medications
                </label>
                <textarea
                  id="medications"
                  name="medications"
                  rows={2}
                  placeholder="List current medications and dosages or type 'None'"
                  defaultValue={p.medications ?? ""}
                  className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)] flex items-center gap-2" htmlFor="conditions">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-outline)]" />
                  Pre-existing Conditions
                </label>
                <textarea
                  id="conditions"
                  name="conditions"
                  rows={3}
                  placeholder="Briefly describe any chronic conditions (e.g., Asthma, Hypertension)"
                  defaultValue={p.conditions ?? ""}
                  className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3">
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