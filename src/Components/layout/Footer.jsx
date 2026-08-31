import React from 'react'
import Link from 'next/link'
import {Heart, Phone, Mail, MapPin, Activity} from 'lucide-react'

export default function Footer() {
    const fg = 'var(--color-footer-fg)'
    const heading = 'var(--color-footer-heading)'
    const divider = 'rgba(255,255,255,0.14)'
    const muted = 'rgba(219,230,255,0.75)'
    const accent = 'var(--color-footer-heading)'

    return (
        <footer style={{ backgroundColor: 'var(--color-footer-bg)', color: fg }} className="pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12 pb-12" style={{ borderBottom: `1px solid ${divider}` }}>

                {/* Brand Col */}
                <div className="lg:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                            <Heart className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold leading-tight" style={{ color: heading }}>TeleMed AI</h2>
                            <p className="text-[10px] font-medium tracking-wide uppercase" style={{ color: 'rgba(139,170,224,0.9)' }}>Your Health. Our Priority.</p>
                        </div>
                    </div>
                    <p className="text-sm mb-6 leading-relaxed" style={{ color: muted }}>
                        We are committed to providing the best healthcare experience with trusted doctors and advanced technology.
                    </p>
                    <Activity className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-semibold text-lg mb-6" style={{ color: heading }}>Quick Links</h4>
                    <ul className="space-y-4 text-sm" style={{ color: muted }}>
                        <li><Link href="/#doctors" className="hover:text-white transition-colors">Find Doctors</Link></li>
                        <li><Link href="/#departments" className="hover:text-white transition-colors">Departments</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/signup" className="hover:text-white transition-colors">Book Appointment</Link></li>
                    </ul>
                </div>

                {/* For Patients */}
                <div>
                    <h4 className="font-semibold text-lg mb-6" style={{ color: heading }}>For Patients</h4>
                    <ul className="space-y-4 text-sm" style={{ color: muted }}>
                        <li><Link href="/login" className="hover:text-white transition-colors">Patient Login</Link></li>
                        <li><Link href="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
                        <li><Link href="/#doctors" className="hover:text-white transition-colors">Find a Doctor</Link></li>
                        <li><Link href="/#departments" className="hover:text-white transition-colors">Browse Departments</Link></li>
                    </ul>
                </div>

                {/* For Doctors */}
                <div>
                    <h4 className="font-semibold text-lg mb-6" style={{ color: heading }}>For Doctors</h4>
                    <ul className="space-y-4 text-sm" style={{ color: muted }}>
                        <li><Link href="/login" className="hover:text-white transition-colors">Doctor Login</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">Join Our Network</Link></li>
                        <li><Link href="/#doctors" className="hover:text-white transition-colors">Manage Appointments</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">Partner With Us</Link></li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h4 className="font-semibold text-lg mb-6" style={{ color: heading }}>Contact Us</h4>
                    <ul className="space-y-5 text-sm" style={{ color: muted }}>
                        <li className="flex items-start gap-3">
                            <Phone className="w-5 h-5 shrink-0" style={{ color: accent }} />
                            <span>+92 300 1234567</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Mail className="w-5 h-5 shrink-0" style={{ color: accent }} />
                            <span>support@telemed.ai</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
                            <span>123 Health Street,<br />Lahore, Pakistan</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'rgba(219,230,255,0.6)' }}>
                <p>© {new Date().getFullYear()} TeleMed AI. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/about" className="hover:text-white transition-colors">Help Center</Link>
                </div>
            </div>
        </footer>
    )
}
