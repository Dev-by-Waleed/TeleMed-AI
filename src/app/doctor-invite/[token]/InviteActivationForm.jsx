'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, Stethoscope } from 'lucide-react';
import { activateInviteDoctorAction } from '@/actions/admin';

export default function InviteActivationForm({ token }) {
  const [state, formAction, isPending] = useActionState(activateInviteDoctorAction, null);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[var(--color-primary)] p-3 rounded-xl text-white mb-4">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold text-center">Activate Your Doctor Account</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 text-center">
            Set a password to activate your account and sign in.
          </p>
        </div>

        <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm">
          {state?.success ? (
            <div className="flex flex-col items-center text-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <p className="text-sm text-[var(--color-on-surface)]">
                Your account is now active. You can sign in with your new password.
              </p>
              <Link
                href="/login"
                className="mt-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="token" value={token} />
              {state?.error && (
                <p role="alert" className="text-sm text-red-600 font-medium">{state.error}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">
                  New Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                  placeholder="At least 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">
                  Confirm Password
                </label>
                <input
                  name="confirm"
                  type="password"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                  placeholder="Re-enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /> Activating...</>) : 'Activate Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
