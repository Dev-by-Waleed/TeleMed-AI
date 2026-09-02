'use client';

import React, { useActionState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AlertTriangle, Pill, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { saveOnboardingAction } from '@/actions/onboarding';
import { onboardingSchema } from '@/lib/validations';

export default function PatientOnboardingForm() {
  const [state, formAction, isPending] = useActionState(saveOnboardingAction, null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(onboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      age: '',
      gender: '',
      height_cm: '',
      weight_kg: '',
      blood_group: '',
      allergies: '',
      medications: '',
      conditions: '',
      emergency_contact: '',
      notes: '',
      past_surgeries: '',
      smoking_status: '',
      chronic_illness_notes: '',
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Profile completed! Let's find you a doctor.");
      router.push('/patient/dashboard');
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const onSubmit = (data) => {
    const fd = new FormData();
    fd.set('age', String(data.age));
    fd.set('gender', data.gender === 'other' ? 'non-binary' : data.gender === 'prefer_not_to_say' ? 'prefer-not-to-say' : data.gender);
    fd.set('height', String(data.height_cm));
    fd.set('weight', String(data.weight_kg));
    fd.set('bloodGroup', data.blood_group ?? '');
    fd.set('allergies', data.allergies ?? '');
    fd.set('medications', data.medications ?? '');
    fd.set('conditions', data.conditions ?? '');
    fd.set('emergencyContact', data.emergency_contact);
    fd.set('notes', data.notes ?? '');
    fd.set('pastSurgeries', data.past_surgeries ?? '');
    fd.set('smokingStatus', data.smoking_status ?? '');
    fd.set('chronicIllnessNotes', data.chronic_illness_notes ?? '');
    startTransition(() => formAction(fd));
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
                min="1"
                max="150"
                placeholder="e.g. 45"
                {...register('age')}
                className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              />
              {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age.message}</p>}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                {...register('gender')}
                className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
            </div>

            {/* Height */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="height_cm">
                Height (cm)
              </label>
              <input
                type="number"
                id="height_cm"
                min="50"
                max="250"
                placeholder="e.g. 175"
                {...register('height_cm')}
                className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              />
              {errors.height_cm && <p className="text-xs text-red-500 mt-1">{errors.height_cm.message}</p>}
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="weight_kg">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight_kg"
                min="2"
                max="400"
                placeholder="e.g. 70"
                {...register('weight_kg')}
                className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              />
              {errors.weight_kg && <p className="text-xs text-red-500 mt-1">{errors.weight_kg.message}</p>}
            </div>

            {/* Emergency Contact */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="emergency_contact">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                id="emergency_contact"
                placeholder="e.g. +1 555 123 4567"
                {...register('emergency_contact')}
                className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
              />
              {errors.emergency_contact && <p className="text-xs text-red-500 mt-1">{errors.emergency_contact.message}</p>}
            </div>
          </div>

          <div className="w-full h-px bg-[var(--color-outline-variant)]/50 my-4"></div>

          {/* Section 1b: Optional Details */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
              Optional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blood Group */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="blood_group">
                  Blood Group
                </label>
                <select
                  id="blood_group"
                  {...register('blood_group')}
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
                >
                  <option value="">Select blood group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Smoking Status */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="smoking_status">
                  Smoking Status
                </label>
                <select
                  id="smoking_status"
                  {...register('smoking_status')}
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
                >
                  <option value="">Select smoking status</option>
                  <option value="never">Never smoked</option>
                  <option value="former">Former smoker</option>
                  <option value="current">Current smoker</option>
                </select>
              </div>
            </div>

            {/* Past Surgeries */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="past_surgeries">
                Past Surgeries
              </label>
              <textarea
                id="past_surgeries"
                rows={2}
                placeholder="List any past surgeries, if any"
                {...register('past_surgeries')}
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
              />
            </div>

            {/* Chronic Illness Notes */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="chronic_illness_notes">
                Chronic Illness Notes
              </label>
              <textarea
                id="chronic_illness_notes"
                rows={2}
                placeholder="Additional notes about any chronic illnesses"
                {...register('chronic_illness_notes')}
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="notes">
                General Notes
              </label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Anything else you'd like to share"
                {...register('notes')}
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
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
                rows={2}
                placeholder="List any known allergies (e.g., Penicillin, Peanuts) or type 'None'"
                {...register('allergies')}
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
                rows={2}
                placeholder="List current medications and dosages or type 'None'"
                {...register('medications')}
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
                rows={3}
                placeholder="Briefly describe any chronic conditions (e.g., Asthma, Hypertension)"
                {...register('conditions')}
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
