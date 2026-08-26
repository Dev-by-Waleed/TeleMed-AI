"use client"

import React, { useActionState } from "react"
import Link from "next/link"
import { loginAction } from "@/actions/auth"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="bg-surface-card border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      
      {/* Error Banner */}
      {state?.error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold tracking-wide text-on-surface"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="patient@example.com"
              className="block w-full pl-11 pr-4 py-2 border border-outline-variant rounded-lg bg-surface-card text-on-surface text-base input-glow transition-all duration-200 outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold tracking-wide text-on-surface"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary-dark transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="block w-full pl-11 pr-4 py-2 border border-outline-variant rounded-lg bg-surface-card text-on-surface text-base input-glow transition-all duration-200 outline-none"
            />
          </div>
        </div>

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