import React from 'react'
import {Heart, Phone , Mail , MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-[#0a1b3f] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12 border-b border-blue-900/50 pb-12">

                {/* Brand Col */}
                <div className="lg:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-blue-500 text-white p-1.5 rounded-lg">
                            <Heart className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight">MediCare+</h2>
                            <p className="text-[10px] text-blue-300 font-medium tracking-wide uppercase">Your Health. Our Priority.</p>
                        </div>
                    </div>
                    <p className="text-sm text-blue-200/80 mb-6 leading-relaxed">
                        We are committed to providing the best healthcare experience with trusted doctors and advanced technology.
                    </p>
                    <div className="flex gap-3">
                        {/* {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-full bg-blue-900/50 flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <Icon className="w-4 h-4 text-white" />
                </button>
              ))} */}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
                    <ul className="space-y-4 text-sm text-blue-200/80">
                        <li><a href="#" className="hover:text-white transition-colors">Find Doctors</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Book Appointment</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Departments</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Tele Consultation</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Health Packages</a></li>
                    </ul>
                </div>

                {/* For Patients */}
                <div>
                    <h4 className="font-semibold text-lg mb-6">For Patients</h4>
                    <ul className="space-y-4 text-sm text-blue-200/80">
                        <li><a href="#" className="hover:text-white transition-colors">Patients Dashboard</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">My Appointments</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Medical History</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Prescriptions</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Health Records</a></li>
                    </ul>
                </div>

                {/* For Doctors */}
                <div>
                    <h4 className="font-semibold text-lg mb-6">For Doctors</h4>
                    <ul className="space-y-4 text-sm text-blue-200/80">
                        <li><a href="#" className="hover:text-white transition-colors">Doctor Dashboard</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Appointments</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Patients</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">E-Prescriptions</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Profile</a></li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
                    <ul className="space-y-5 text-sm text-blue-200/80">
                        <li className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                            <span>+92 300 1234567</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                            <span>support@medicare.com</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <span>123 Health Street,<br />Lahore, Pakistan</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-200/60">
                <p>© 2024 MediCare+. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Help Center</a>
                </div>
            </div>
        </footer>
    )
}
