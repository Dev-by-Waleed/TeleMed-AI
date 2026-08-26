'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import {
  Activity,
  Bell,
  Heart,
  HeartPulse,
  Thermometer,
  Wind,
  Paperclip,
  Send,
  Video,
  MessageSquare,
  Stethoscope,
  Info,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function PatientConsultation() {
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
      textareaRef.current.style.overflowY = e.target.scrollHeight > 128 ? 'auto' : 'hidden';
    }
  };

  return (
    <div className="h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)] font-sans overflow-hidden flex flex-col antialiased">
      {/* Top Navigation Bar */}
      {/* <nav className="bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)] flex justify-between items-center w-full px-6 md:px-10 h-16 shrink-0 z-50 fixed top-0 left-0">
        <div className="flex items-center gap-2">
          <Activity className="text-[var(--color-primary)] w-7 h-7" />
          <h1 className="text-xl font-bold text-[var(--color-primary)] tracking-tight">
            TeleMed Patient Portal
          </h1>
        </div>

        <div className="hidden md:flex space-x-8 h-full items-center">
          <a href="#" className="text-[var(--color-on-secondary-container)] text-sm font-semibold hover:text-[var(--color-primary)] transition-colors duration-200">
            Dashboard
          </a>
          <a href="#" className="text-[var(--color-on-secondary-container)] text-sm font-semibold hover:text-[var(--color-primary)] transition-colors duration-200">
            Medical Records
          </a>
          <a href="#" className="text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1 text-sm font-semibold hover:text-[var(--color-primary)] transition-colors duration-200 h-full flex items-center mt-[2px]">
            Consultations
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <button aria-label="Notifications" className="text-[var(--color-on-secondary-container)] hover:text-[var(--color-primary)] transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-[var(--color-outline-variant)] cursor-pointer">
            <Image 
              alt="Patient Profile Avatar" 
              width={32} 
              height={32} 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZAd3eZ0n784pJT1Y-HJ-LdJiPwOGScm4PrbU91t4L1t253lyDRCTaeJjZGjD7MPgte0zlihyESDmDAp4E4VhPjiJQAuU_Vz2MsK1mN_zb6dVp8lVnwa2xhTO9rzHgjXfseiYx8I8yQwEyjI6Jghn8KmcS1MA78_tGaNBaYF9SMp2CXrePgC-4r4aIaLxKJhATYaatrX2uQRPg0jsCAUZB8l3muDFuQzKFWjFre4_bnq-9ea6SbK-LikZGuin4VSJQDRitO-iwsg"
            />
          </div>
        </div>
      </nav> */}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full max-w-[1440px] mx-auto bg-[var(--color-surface-bright)]">
        
        {/* Left Panel: Patient Details & Transmitted Vitals (40%) */}
        <section className="w-full lg:w-2/5 h-full overflow-y-auto border-r border-[var(--color-outline-variant)] p-6 flex flex-col gap-6 bg-[var(--color-surface)]">
          
          {/* Doctor Info Card */}
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-4 shadow-sm flex items-start gap-4">
             <div className="w-14 h-14 rounded-full overflow-hidden border border-[var(--color-outline-variant)] shrink-0">
               {/* <Image 
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMVcsyJUZ-W6FZSVvGxtWpJwp2cX2MhP5oejopfssYdqx5C8RSbJPsK6nPOItXGmEScy79kMjhCpGwEvozOxAx_SVFyu7-wzJj4apFl0886jb2wtNYM__lbkdX88xC65Y0SSgxy_FPVU-aYrF3gOYZaeTqBGafgrJaI0ZQ-MOiMb_RHCZAFLr_hFnb57h0typsXi2kXfwsitQP0KLR8aG7n4GV_Ala9-30nuWvHOXPDGwe4tFr9YqtCK7YPXUHNFM18b-rxoRfA" 
                 alt="Doctor Profile" 
                 width={56} 
                 height={56}
                 className="object-cover w-full h-full"
               /> */}
             </div>
             <div className="flex-1">
               <h3 className="text-base font-semibold text-[var(--color-on-surface)] flex items-center gap-2">
                 Dr. Sarah Smith
               </h3>
               <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1 mt-0.5">
                 <Stethoscope className="w-3.5 h-3.5 text-[var(--color-on-surface-variant)]" /> Primary Care Physician
               </p>
               <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[var(--color-neutral)] bg-[var(--color-surface-container)] px-2 py-1 rounded">
                 <Clock className="w-3.5 h-3.5" /> 
                 Session Active
               </div>
             </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
                <Heart className="w-4 h-4 text-[var(--color-error)]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Heart Rate</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--color-on-surface)]">72</span>
                <span className="text-xs text-[var(--color-on-surface-variant)]">bpm</span>
              </div>
            </div>

            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
                <HeartPulse className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Blood Pressure</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--color-on-surface)]">120/80</span>
              </div>
            </div>

            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
                <Thermometer className="w-4 h-4 text-[var(--color-tertiary-container)]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Temperature</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--color-on-surface)]">98.6</span>
                <span className="text-xs text-[var(--color-on-surface-variant)]">°F</span>
              </div>
            </div>

            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
                <Wind className="w-4 h-4 text-[var(--color-on-tertiary-container)]" />
                <span className="text-xs font-semibold uppercase tracking-wider">SpO2</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--color-on-surface)]">99</span>
                <span className="text-xs text-[var(--color-on-surface-variant)]">%</span>
              </div>
            </div>
          </div>

          {/* Patient Record Information */}
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl flex flex-col shadow-sm flex-1 min-h-[220px]">
            <div className="flex items-center border-b border-[var(--color-outline-variant)] px-3 py-2 bg-[var(--color-surface-container-low)]">
              <h4 className="text-sm font-semibold text-[var(--color-on-surface)] flex items-center gap-2">
                <Info className="w-4 h-4 text-[var(--color-primary)]" />
                My Medical Summary
              </h4>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto">
              <div>
                <h5 className="text-xs uppercase font-semibold text-[var(--color-on-surface-variant)] tracking-wider mb-2">Logged Allergies</h5>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] text-xs font-semibold px-2.5 py-1 rounded-md border border-[var(--color-error)]/20 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Penicillin (Severe)
                  </div>
                  <div className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-xs font-semibold px-2.5 py-1 rounded-md border border-[var(--color-outline-variant)]">
                    Latex (Mild)
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs uppercase font-semibold text-[var(--color-on-surface-variant)] tracking-wider mb-2">Known Conditions</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-sm text-[var(--color-on-surface)] font-medium">Hypertension</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">Diagnosed: 2020</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-sm text-[var(--color-on-surface)] font-medium">Hyperlipidemia</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">Diagnosed: 2022</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Live Chat (60%) */}
        <section className="w-full lg:w-3/5 h-full flex flex-col relative bg-[var(--color-surface-bright)]">
          
          {/* Chat Header */}
          <div className="bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)] p-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex space-x-6">
              <button className="text-[var(--color-primary)] text-sm border-b-2 border-[var(--color-primary)] pb-1 mt-1 font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Live Transcript
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm">
                <Video className="w-3.5 h-3.5" />
                Join Video Call
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-surface)]">
            
            {/* System Message */}
            <div className="flex justify-center">
              <span className="bg-[var(--color-surface-container)] text-xs text-[var(--color-on-surface-variant)] px-3 py-1 rounded-full font-medium">
                Consultation started at 10:00 AM
              </span>
            </div>

            {/* Doctor Message (Left) */}
            <div className="flex justify-start">
              <div className="max-w-[70%]">
                <div className="bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] rounded-lg rounded-tl-none p-3 shadow-sm border border-[var(--color-outline-variant)]/30">
                  <p className="text-sm">Good morning, John. I see you're experiencing some chest discomfort. Can you tell me more about when it started?</p>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] text-left mt-1">Dr. Smith • 10:02 AM</p>
              </div>
            </div>

            {/* Patient Message (Right) */}
            <div className="flex justify-end">
              <div className="max-w-[70%]">
                <div className="bg-[var(--color-primary)] text-white rounded-lg rounded-tr-none p-3 shadow-sm">
                  <p className="text-sm">Hi Dr. Smith. It started about two days ago. It feels like a dull ache right in the center of my chest, mostly when I walk up stairs.</p>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] text-right mt-1">10:04 AM</p>
              </div>
            </div>

            {/* Doctor Message (Left) */}
            <div className="flex justify-start">
              <div className="max-w-[70%]">
                <div className="bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] rounded-lg rounded-tl-none p-3 shadow-sm border border-[var(--color-outline-variant)]/30">
                  <p className="text-sm">I understand. Does the pain spread anywhere else, like your arm or jaw? And how long does it usually last?</p>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] text-left mt-1">Dr. Smith • 10:05 AM</p>
              </div>
            </div>

            {/* Patient Message (Right) */}
            <div className="flex justify-end">
              <div className="max-w-[70%]">
                <div className="bg-[var(--color-primary)] text-white rounded-lg rounded-tr-none p-3 shadow-sm">
                  <p className="text-sm">No, it doesn't spread. It usually goes away after about 10 minutes if I sit down and rest.</p>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] text-right mt-1">10:07 AM</p>
              </div>
            </div>

          </div>

          {/* Input Area */}
          <div className="bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)] p-3 sticky bottom-0">
            <form 
              className="flex items-end gap-2" 
              onSubmit={(e) => e.preventDefault()}
            >
              <button 
                type="button"
                className="p-2.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] rounded-lg transition-colors"
                aria-label="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="flex-1 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all p-1 relative">
                <textarea 
                  ref={textareaRef}
                  onChange={handleInput}
                  className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm p-2 max-h-32 outline-none text-[var(--color-on-surface)]" 
                  placeholder="Type your message..." 
                  rows={1}
                />
              </div>

              <button 
                type="submit"
                className="bg-[var(--color-primary)] text-white p-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}