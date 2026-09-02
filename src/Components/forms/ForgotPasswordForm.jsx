"use client"

import React, { useActionState, useEffect, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { useForm, useController } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordAction } from "@/actions/password"
import { forgotPasswordSchema } from "@/lib/validations"
import { Mail, ArrowLeft, Loader2, CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react"
import AuthField from "@/Components/ui/AuthField"
import { toast } from "sonner"

const RESEND_WAIT_SECONDS = 60

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null)
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  })
  const emailField = useController({ control, name: "email" })
  const [, startTransition] = useTransition()
  const [sentAt, setSentAt] = useState(null)
  const [resendError, setResendError] = useState(null)
  // Read the ?status=invalid_link flag once at mount (window is undefined
  // during SSR/prerender, so guard it).
  const [invalidLink, setInvalidLink] = useState(() => {
    if (typeof window === "undefined") return false
    return new URLSearchParams(window.location.search).get("status") === "invalid_link"
  })
  const formRef = useRef(null)

  useEffect(() => {
    if (state?.success) {
      toast.success("Reset link sent!")
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  const onSubmit = (data) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => fd.set(k, String(v)))
    startTransition(() => formAction(fd))
  }

  const handleResend = () => {
    setResendError(null)
    setInvalidLink(false)

    // Enforce a client-side cooldown so users don't spam send and then
    // wonder why no new email arrives (Supabase throttles resets silently).
    if (sentAt && Date.now() - sentAt < RESEND_WAIT_SECONDS * 1000) {
      const remaining = Math.ceil(RESEND_WAIT_SECONDS - (Date.now() - sentAt) / 1000)
      setResendError(`Please wait ${remaining}s before requesting another link.`)
      return
    }

    setSentAt(Date.now())
    handleSubmit(onSubmit)()
  }

  if (state?.success) {
    return (
      <div className="bg-surface-card border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-on-surface">Check your email</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            If an account exists for that address, we&apos;ve sent a password reset link.
            It may take a few minutes to arrive.
          </p>

          {resendError && (
            <p className="text-xs text-amber-600 font-medium">{resendError}</p>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Resend link
          </button>

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
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
          {state.error}
        </div>
      )}

      {invalidLink && (
        <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 text-sm font-medium text-center">
          <span className="inline-flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Your reset link was already used or has expired. Request a new one below
            and use it right away.
          </span>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          icon={<Mail className="w-5 h-5" />}
          autoComplete="email"
          placeholder="patient@example.com"
          value={emailField.field.value}
          onChange={emailField.field.onChange}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center items-center gap-2 py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send reset link"
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
