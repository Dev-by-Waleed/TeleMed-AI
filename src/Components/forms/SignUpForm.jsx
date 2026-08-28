"use client";

import React, { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupAction } from "@/actions/auth";
import { User, Mail, Lock, KeyRound, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import AuthField from "@/Components/ui/AuthField";
import PasswordStrength from "@/Components/ui/PasswordStrength";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signupAction, null);
  const [password, setPassword] = useState("");
  const router = useRouter();

  const showStrength = useMemo(() => password.length > 0, [password]);

  // Redirect to the destination returned by the server action.
  // A plain client redirect (rather than redirect() inside the action) keeps
  // useActionState's isPending state from getting stuck.
  useEffect(() => {
    if (state?.destination) {
      router.push(state.destination);
    }
  }, [state, router]);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4 md:p-10 antialiased">
      <main className="w-full max-w-[440px] mx-auto">
        {/* Brand / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white mb-4 shadow-sm">
            <User className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">
            Create your account
          </h1>
          <p className="text-base text-on-surface-variant mt-1">
            Join TeleMed AI to start your care journey.
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-surface-card border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
          {state?.error && (
            <div
              role="alert"
              className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center"
            >
              {state.error}
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-5">
            <AuthField
              id="fullName"
              name="fullName"
              type="text"
              label="Full Name"
              icon={<User className="w-5 h-5" />}
              required
              autoComplete="name"
              placeholder="Jane Doe"
              variant="surface"
            />

            <AuthField
              id="email"
              name="email"
              type="email"
              label="Email Address"
              icon={<Mail className="w-5 h-5" />}
              required
              autoComplete="email"
              placeholder="jane@example.com"
              variant="surface"
            />

            <AuthField
              id="password"
              name="password"
              type="password"
              label="Password"
              icon={<Lock className="w-5 h-5" />}
              required
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="surface"
            >
              {showStrength && <PasswordStrength password={password} />}
            </AuthField>

            <AuthField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              icon={<KeyRound className="w-5 h-5" />}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
              variant="surface"
            />

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-start gap-2 mt-1">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface cursor-pointer"
                />
              </div>
              <div className="text-xs">
                <label htmlFor="agreeTerms" className="text-on-surface-variant leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline font-semibold"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline font-semibold"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full py-2.5 px-6 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 flex justify-center items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline ml-1 transition-all"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Secure Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-outline text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Your information is encrypted and secure</span>
        </div>
      </main>
    </div>
  );
}
