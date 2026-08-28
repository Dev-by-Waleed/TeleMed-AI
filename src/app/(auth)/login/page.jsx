import React from "react"
import LoginForm from "@/Components/forms/LoginForm"
import { Stethoscope, ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Login | TeleMed AI",
  description: "Access your patient, doctor, or administrator portal.",
}

export default function LoginPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4 md:p-10 antialiased">
      <main className="w-full max-w-[440px] mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white mb-4 shadow-sm">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">
            TeleMed AI
          </h1>
          <p className="text-base text-on-surface-variant mt-1">
            Welcome back. Please log in to your portal.
          </p>
        </div>

        {/* Client Form Component */}
        <LoginForm />

        {/* Secure Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-outline text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure, encrypted portal</span>
        </div>
      </main>
    </div>
  )
}