import React from "react"
import ResetPasswordForm from "@/Components/forms/ResetPasswordForm"
import { KeyRound } from "lucide-react"

export const metadata = {
  title: "Reset Password | TeleMed AI",
  description: "Choose a new password for your TeleMed AI account.",
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4 md:p-10 antialiased">
      <main className="w-full max-w-[440px] mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white mb-4 shadow-sm">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">
            Set a new password
          </h1>
          <p className="text-base text-on-surface-variant mt-1">
            Choose a strong password for your account.
          </p>
        </div>

        <ResetPasswordForm />
      </main>
    </div>
  )
}
