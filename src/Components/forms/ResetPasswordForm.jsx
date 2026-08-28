"use client"

import React, { useActionState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { resetPasswordAction } from "@/actions/password"
import { Lock, KeyRound, Loader2, CheckCircle2, ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react"
import AuthField from "@/Components/ui/AuthField"
import PasswordStrength from "@/Components/ui/PasswordStrength"

export default function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null)
  const [password, setPassword] = React.useState("")
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push("/login")
    }
  }, [state, router])

  if (state?.success) {
    return (
      <div className="bg-surface-card border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-on-surface">Password updated</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Your password has been reset. You can now sign in with your new credentials.
          </p>
          <Link
            href="/login"
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  // A dead/expired recovery link shouldn't leave the user at a dead end.
  if (state?.expiredLink) {
    return (
      <div className="bg-surface-card border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-on-surface">Link expired or used</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Reset links expire quickly and can only be used once. Request a fresh link
            and use it right away to avoid it expiring again.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 w-full justify-center py-2.5 px-6 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Request a new link
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-card border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {state?.error && (
        <div
          role="alert"
          className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <AuthField
          id="password"
          name="password"
          type="password"
          label="New Password"
          icon={<Lock className="w-5 h-5" />}
          required
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
          {password.length > 0 && <PasswordStrength password={password} />}
        </AuthField>

        <AuthField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          icon={<KeyRound className="w-5 h-5" />}
          required
          autoComplete="new-password"
          placeholder="Re-enter your new password"
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center items-center gap-2 py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Reset password"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  )
}
