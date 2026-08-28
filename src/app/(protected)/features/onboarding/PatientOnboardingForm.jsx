'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Pill, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { saveOnboardingAction } from '@/actions/onboarding';

export default function PatientOnboardingForm() {
  const [state, formAction, isPending] = useActionState(saveOnboardingAction, null);
  const router = useRouter();

  // Redirect to the patient dashboard once the profile is successfully saved.
  useEffect(() => {
    if (state?.success) {
      router.push('/patient/dashboard');
      router.refresh();
    }
  }, [state, router]);

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-4 md:p-10 bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="w-full max-w-2xl bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 md:p-12 shadow-md transition-all duration-300">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-primary-dark)] mb-2">
            Patient Onboarding
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Please provide your medical details to help us personalize your care.
          </p>
        </div>

        {state?.error && (
          <div
            role="alert"
            className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center"
          >
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-6">

          {/* Section 1: Basic Vitals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
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
                placeholder="e.g. 45"
                required
                className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                defaultValue=""
                className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            {/* Height */}
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
                placeholder="e.g. 175"
                required
                className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              />
            </div>

            {/* Weight */}
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
                placeholder="e.g. 70"
                required
                className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              />
            </div>
          </div>

          <div className="w-full h-px bg-[var(--color-outline-variant)]/50 my-4"></div>

          {/* Section 2: Medical History */}
          <div className="space-y-6">
            {/* Allergies */}
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
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
              />
            </div>

            {/* Current Medications */}
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
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
              />
            </div>

            {/* Pre-existing Conditions */}
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
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Profile &amp; Find a Doctor
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}
