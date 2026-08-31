import React from "react"
import Link from "next/link"
import {
  Stethoscope, Users, ShieldCheck, Video, HeartHandshake, ArrowRight
} from "lucide-react"
import Navbar from "@/Components/layout/Navbar"
import Footer from "@/Components/layout/Footer"

export const metadata = {
  title: "About Us | TeleMed AI",
  description: "Learn about TeleMed AI — our mission to make healthcare accessible through telemedicine.",
}

const values = [
  {
    icon: <Stethoscope className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />,
    title: "Expert Care",
    desc: "Connect with verified doctors across 30+ specialties, all from the comfort of home.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />,
    title: "Secure & Private",
    desc: "Your health data is protected with bank-grade encryption and strict access controls.",
  },
  {
    icon: <Video className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />,
    title: "Anywhere, Anytime",
    desc: "Book appointments, attend video consultations, and get e-prescriptions on any device.",
  },
  {
    icon: <HeartHandshake className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />,
    title: "Patient First",
    desc: "A compassionate experience built around your needs, comfort, and well-being.",
  },
]

const milestones = [
  { count: "12,500+", label: "Happy Patients" },
  { count: "1,200+", label: "Expert Doctors" },
  { count: "25,000+", label: "Appointments" },
  { count: "30+", label: "Specialties" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans relative transition-colors duration-300" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <Navbar variant="public" />

      {/* HERO */}
      <section className="relative border-b" style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-outline-variant)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
            <Stethoscope className="w-9 h-9" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Transforming Healthcare, <br className="hidden md:block" />
            <span style={{ color: 'var(--color-primary)' }}>One Consultation at a Time</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            TeleMed AI brings trusted doctors and advanced technology together to make quality
            healthcare fast, affordable, and accessible to everyone.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Our Mission</h2>
        <p className="text-center leading-relaxed max-w-3xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
          We believe that nobody should have to wait weeks for a medical appointment or travel long
          distances to see a specialist. Our mission is to connect patients with experienced doctors
          through secure video consultations, digital prescriptions, and AI-assisted insights — so
          that getting the care you need is just a few clicks away.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 text-center shadow-sm transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--color-surface-bright)', border: '1px solid var(--color-outline-variant)' }}
            >
              <h3 className="text-2xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{m.count}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y" style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-outline-variant)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-surface-bright)', border: '1px solid var(--color-outline-variant)' }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-primary-container)' }}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Users className="w-6 h-6" />, step: "01", title: "Create an Account", desc: "Sign up as a patient in seconds and complete a quick medical profile." },
            { icon: <Stethoscope className="w-6 h-6" />, step: "02", title: "Find Your Doctor", desc: "Search by specialty, compare ratings, and pick a time that suits you." },
            { icon: <Video className="w-6 h-6" />, step: "03", title: "Consult Online", desc: "Meet your doctor via secure video, get diagnosed, and receive an e-prescription." },
          ].map((s, idx) => (
            <div key={idx} className="rounded-2xl p-8 shadow-sm text-center relative" style={{ backgroundColor: 'var(--color-surface-bright)', border: '1px solid var(--color-outline-variant)' }}>
              <span className="absolute top-4 right-6 text-5xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{s.step}</span>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                {s.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="rounded-3xl px-8 py-12 md:p-16 text-center" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to See a Doctor?</h2>
          <p style={{ color: 'var(--color-on-primary)', opacity: 0.85 }} className="max-w-xl mx-auto mb-8">
            Join thousands of patients who trust TeleMed AI for fast, secure, and caring healthcare.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-on-primary)', color: 'var(--color-primary)' }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#doctors"
              className="px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.5)', color: 'var(--color-on-primary)' }}
            >
              Find a Doctor
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
