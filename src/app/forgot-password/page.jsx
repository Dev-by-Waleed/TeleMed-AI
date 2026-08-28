import React from "react"
import ForgotPasswordForm from "@/Components/forms/ForgotPasswordForm"
import { Stethoscope } from "lucide-react"

export const metadata = {
  title: "Forgot Password | TeleMed AI",
  description: "Reset your TeleMed AI account password.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4 md:p-10 antialiased">
      <main className="w-full max-w-[440px] mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white mb-4 shadow-sm">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">TeleMed AI</h1>
          <p className="text-base text-on-surface-variant mt-1">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <ForgotPasswordForm />
      </main>
    </div>
  )
}
