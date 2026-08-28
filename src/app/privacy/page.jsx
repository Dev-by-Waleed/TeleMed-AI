import React from "react"
import Link from "next/link"
import { Stethoscope } from "lucide-react"

export const metadata = {
  title: "Privacy Policy | TeleMed AI",
  description: "Privacy Policy for TeleMed AI.",
}

export default function PrivacyPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen antialiased">
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white mb-4 shadow-sm">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-on-surface-variant mt-2">Last updated: August 28, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, including your name, email address, and
              any health information you choose to share (such as symptoms, medications, and
              medical history) for the purpose of providing virtual consultations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">2. How We Use Information</h2>
            <p>
              We use your information to provide and improve the service, facilitate consultations,
              communicate with you, and ensure the security of our platform. We do not sell your
              personal or health information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">3. Data Security</h2>
            <p>
              We use reasonable administrative, technical, and physical safeguards to protect your
              information, including encryption in transit. Row-level security restricts access to
              your data to authorized parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">4. Sharing of Information</h2>
            <p>
              Your health information is shared only with the healthcare providers involved in your
              care. We may share aggregate, de-identified data for analytics and service improvement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">5. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information at
              any time. You may also withdraw consent for processing where applicable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-on-surface">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact your TeleMed AI
              platform administrator.
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
