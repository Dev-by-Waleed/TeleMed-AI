import React from "react"
import Link from "next/link"
import { MailCheck } from "lucide-react"

export const metadata = {
  title: "Check Your Email | TeleMed AI",
  description: "Confirm your email address to activate your TeleMed AI account.",
}

export default function ConfirmEmailPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4 md:p-10 antialiased">
      <main className="w-full max-w-[440px] mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white mb-4 shadow-sm">
            <MailCheck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">
            Check your email
          </h1>
        </div>

        <div className="bg-surface-card border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm text-center space-y-4">
          <p className="text-base text-on-surface-variant leading-relaxed">
            We&apos;ve sent a confirmation link to your email address.
            Click the link to activate your account before signing in.
          </p>
          <p className="text-sm text-outline">
            The link expires shortly. Be sure to check your spam folder if it
            doesn&apos;t arrive within a few minutes.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-2.5 px-6 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </main>
    </div>
  )
}
