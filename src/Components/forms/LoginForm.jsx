"use client"

import React, { useActionState, useEffect, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useController } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginAction } from "@/actions/auth"
import { loginSchema } from "@/lib/validations"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import AuthField from "@/Components/ui/AuthField"
import { toast } from "sonner"

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  })
  const emailField = useController({ control, name: "email" })
  const passwordField = useController({ control, name: "password" })
  const router = useRouter()
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (state?.success) {
      toast.success("Welcome back!")
    } else if (state?.error) {
      toast.error(state.error)
    }
    if (state?.destination) {
      router.push(state.destination)
    }
  }, [state, router])

  const onSubmit = (data) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => fd.set(k, String(v)))
    startTransition(() => formAction(fd))
  }

  return (
    <div className="bg-surface-card border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">

      {/* Error Banner */}
      {state?.error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <AuthField
          id="password"
          name="password"
          type="password"
          label="Password"
          icon={<Lock className="w-5 h-5" />}
          autoComplete="current-password"
          placeholder="••••••••"
          labelExtra={
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary-dark transition-colors"
            >
              Forgot Password?
            </Link>
          }
          value={passwordField.field.value}
          onChange={passwordField.field.onChange}
        />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center items-center gap-2 py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="my-8 relative">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-surface-card text-xs text-outline">or</span>
        </div>
      </div>

      {/* Signup Link */}
      <div className="text-center">
        <p className="text-sm text-on-surface-variant">
          New to TeleMed AI?{" "}
          <Link
            href="/signup"
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors ml-1"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
