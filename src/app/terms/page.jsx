import React from "react"
import Link from "next/link"
import { Stethoscope } from "lucide-react"

export const metadata = {
  title: "Terms of Service | TeleMed AI",
  description: "Terms of Service for TeleMed AI.",
}

export default function TermsPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen antialiased">
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white mb-4 shadow-sm">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">Terms of Service</h1>
          <p className="text-sm text-on-surface-variant mt-2">Last updated: August 28, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">1. Acceptance of Terms</h2>
            <p>
              By accessing or using TeleMed AI, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">2. Use of the Service</h2>
            <p>
              TeleMed AI connects patients with healthcare providers for virtual consultations.
              The service is provided for general information and communication purposes and does
              not replace professional medical advice, diagnosis, or treatment. Always seek the
              advice of a qualified health provider with any questions you may have regarding a
              medical condition.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">3. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You agree to provide accurate
              and current information during registration.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">4. No Warranty</h2>
            <p>
              The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis
              without warranties of any kind, whether express or implied.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, TeleMed AI shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising out of or
              related to your use of the service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">6. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued use of the service
              after changes take effect constitutes acceptance of the revised terms.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/login" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
            Back to login
          </Link>
        </div>
      </main>
    </div>
  )
}
