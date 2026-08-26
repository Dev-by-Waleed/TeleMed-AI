'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Sidebar from '@/Components/Sidebar';
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
  Sparkles,
  FileText,
  Edit3,
  ExternalLink,
  AlertTriangle,
  Pill,
  Clock,
  ChevronRight,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export default function DoctorConsultation() {
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState('transcript');

  const handleInput = (e) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
      textareaRef.current.style.overflowY = e.target.scrollHeight > 128 ? 'auto' : 'hidden';
    }
  };

  return (
    <div className="h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)] font-sans overflow-hidden flex flex-col antialiased">
      {/* Top Professional Navigation Bar */}
      {/* <nav className="bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)] flex justify-between items-center w-full px-6 md:px-10 h-16 shrink-0 z-50 fixed top-0 left-0">
        <div className="flex items-center gap-2">
          <Activity className="text-[var(--color-primary)] w-7 h-7" />
          <h1 className="text-xl font-bold text-[var(--color-primary)] tracking-tight">
            TeleMed Professional
          </h1>
        </div>

        <div className="hidden md:flex space-x-8 h-full items-center">
          <a href="#" className="text-[var(--color-on-secondary-container)] text-sm font-semibold hover:text-[var(--color-primary)] transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-[var(--color-on-secondary-container)] text-sm font-semibold hover:text-[var(--color-primary)] transition-colors">
            My Patients
          </a>
          <a href="#" className="text-[var(--color-on-secondary-container)] text-sm font-semibold hover:text-[var(--color-primary)] transition-colors">
            Schedule
          </a>
          <a href="#" className="text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1 text-sm font-semibold hover:text-[var(--color-primary)] transition-colors h-full flex items-center mt-[2px]">
            Active Consultation
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <button aria-label="Notifications" className="text-[var(--color-on-secondary-container)] hover:text-[var(--color-primary)] transition-colors p-2 rounded-full hover:bg-[var(--color-surface-container-low)]">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 pl-2 border-l border-[var(--color-outline-variant)]">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-[var(--color-outline-variant)] cursor-pointer shrink-0">
              <img 
                alt="Doctor Profile Avatar" 
                width={36} 
                height={36} 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUD_fGYbxGYwE6L06ioYUppaXmBmOmRVevMlfP-EshjpR5qcjvi8iAauXJFXHFGA7jEGqq1aM1_sV2WmaRjSE5_yUrm4jgFc3WoZCMQHhrw13TvwGWdrHcp5gANwSQ28mxCKYJksWNgcHVH6FPngKl8ciB1KJtUIekUY5OhUMiJs15hPSwAR-wnhyZsfea_PH_r9SzqOePjlB6-XMDJE_p41AoK6ROr_2RxlxPtdzvDl7wgsxgWprsPOXRjikth5ft12GA3s0r5A"
              />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-[var(--color-on-surface)] leading-none">Dr. Smith</p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">Cardiologist</p>
            </div>
          </div>
        </div>
      </nav> */}
      <div className="flex flex-col lg:flex-row flex-1 w-full max-w-[1600px] mx-auto">

        <Sidebar />
        {/* Main Workspace Canvas */}
        <main className="flex-1 flex flex-col p-4 md:p-6 gap-4 bg-[var(--color-surface-bright)] overflow-y-auto">

          {/* Workspace Context Bar */}
<div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--color-on-surface-variant)] w-full"> 
  <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-on-surface-variant)]"> 
              <span>Consultations</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-outline)]" />
              <span className="text-[var(--color-on-surface)] font-bold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[var(--color-primary)]" />
                Active Session: Eleanor Vance
              </span>
            </div>

  <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[var(--color-error-container)] text-[var(--color-on-error-container)] px-3 py-1 rounded-full text-xs font-semibold">
                <div className="w-2 h-2 bg-[var(--color-error)] rounded-full animate-pulse"></div>
                Session Recording Active
              </div>
              <button className="bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm">
                <Video className="w-3.5 h-3.5" />
                Launch Video Frame
              </button>
            </div>
          </div>

          {/* Workspace Bento Layout */}
          <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">

            {/* Left Main Column: Live Interactive Workspace & Care Suite (col-span-8) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col h-full min-h-0 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden shadow-sm">

              {/* Control Tabs Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] px-4 py-2 bg-[var(--color-surface-container-low)] shrink-0">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`text-xs font-bold pb-2 pt-1 transition-colors flex items-center gap-1.5 border-b-2 ${activeTab === 'transcript'
                      ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                      : 'text-[var(--color-on-surface-variant)] border-transparent hover:text-[var(--color-primary)]'
                      }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Live Transcript
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`text-xs font-bold pb-2 pt-1 transition-colors flex items-center gap-1.5 border-b-2 ${activeTab === 'summary'
                      ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                      : 'text-[var(--color-on-surface-variant)] border-transparent hover:text-[var(--color-primary)]'
                      }`}
                  >
                    <Sparkles className="w-4 h-4 text-[var(--color-tertiary-container)]" />
                    AI Auto-Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('plan')}
                    className={`text-xs font-bold pb-2 pt-1 transition-colors flex items-center gap-1.5 border-b-2 ${activeTab === 'plan'
                      ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                      : 'text-[var(--color-on-surface-variant)] border-transparent hover:text-[var(--color-primary)]'
                      }`}
                  >
                    <FileText className="w-4 h-4" />
                    Draft Care Plan
                  </button>
                </div>

                <button className="text-[var(--color-primary)] text-xs font-semibold hover:underline flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  Quick Clinical Note
                </button>
              </div>

              {/* Transcript & Interactive Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[var(--color-surface-bright)]">

                <div className="flex justify-center">
                  <span className="bg-[var(--color-surface-container)] text-[11px] text-[var(--color-on-surface-variant)] px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Consultation initialized at 10:00 AM
                  </span>
                </div>

                {/* Doctor Statement */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    Dr
                  </div>
                  <div className="bg-[var(--color-surface-card)] text-[var(--color-on-surface)] p-3 rounded-lg rounded-tl-none border border-[var(--color-outline-variant)]/60 max-w-[80%] shadow-sm">
                    <p className="text-xs leading-relaxed">
                      Hello Eleanor, how have you been feeling since we adjusted your Metformin dosage last week?
                    </p>
                    <span className="text-[10px] text-[var(--color-on-surface-variant)] mt-1.5 block">10:02 AM</span>
                  </div>
                </div>

                {/* Patient Response */}
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] flex items-center justify-center shrink-0 text-xs font-bold border border-[var(--color-outline-variant)]">
                    EV
                  </div>
                  <div className="bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] p-3 rounded-lg rounded-tr-none border border-[var(--color-outline-variant)]/40 max-w-[80%] shadow-sm">
                    <p className="text-xs leading-relaxed">
                      Hi Dr. Smith. Honestly, I've been feeling a bit nauseous in the mornings, and my fasting numbers are still hovering around 130 mg/dL.
                    </p>
                    <span className="text-[10px] text-[var(--color-on-surface-variant)] mt-1.5 block text-right">10:03 AM</span>
                  </div>
                </div>

                {/* Doctor Statement with Active Pulse */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    Dr
                  </div>
                  <div className="bg-[var(--color-surface-card)] text-[var(--color-on-surface)] p-3 rounded-lg rounded-tl-none border border-[var(--color-outline-variant)]/60 max-w-[80%] shadow-sm">
                    <p className="text-xs leading-relaxed">
                      I see. Nausea can be a common side effect early on. Let's review your food log and see if taking it with a larger meal helps.
                      <span className="animate-pulse inline-block w-1.5 h-3.5 bg-[var(--color-primary)] align-middle ml-1"></span>
                    </p>
                    <span className="text-[10px] text-[var(--color-on-surface-variant)] mt-1.5 block">10:05 AM</span>
                  </div>
                </div>

              </div>

              {/* Doctor Message Input Dock */}
              <div className="bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)] p-3 shrink-0">
                <form className="flex items-end gap-2" onSubmit={(e) => e.preventDefault()}>
                  <button
                    type="button"
                    className="p-2.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] rounded-lg transition-colors hover:bg-[var(--color-surface-container-low)]"
                    aria-label="Attach clinical document"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <div className="flex-1 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all p-1">
                    <textarea
                      ref={textareaRef}
                      onChange={handleInput}
                      className="w-full bg-transparent border-none focus:ring-0 resize-none text-xs p-2 max-h-28 outline-none text-[var(--color-on-surface)]"
                      placeholder="Type clinical instruction or response..."
                      rows={1}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[var(--color-primary)] text-white p-2.5 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

            {/* Right Panel: Focused Patient Context & Vitals Suite (col-span-4) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full overflow-y-auto pr-0.5">

              {/* Patient Header Card */}
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-[var(--color-outline-variant)] shrink-0">
                  {/* <Image 
                  alt="Patient Avatar" 
                  width={48} 
                  height={48} 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjLmpeHble1MMnFeCqPl2OK9UYmcSObh124HIXBOY4fRU80RnsfoK7kQ7DtegDK8UGSgAOc8sPrNxBrybNSSmtLg-uY0e0aofCkNdJuXH975pAkhzIe1EnbBGpL2Ck8SL9iaDXHXSiAXd0rc_upcBUIaMHjXrJkb-mr5ZD8Fcv_RV5udkEOZEPpjVceglr1uRdfGUafGAzGw2r_m6mcsBhkh-8fYS-ABebDlCUVIuYrX0AYySa9I5-LhCXj0mrj_aIji4NRJHa7g"
                /> */}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[var(--color-on-surface)] leading-tight">Eleanor Vance</h3>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">F • 42 yrs • ID: #PT-8842</p>
                </div>
                <button
                  title="Open Full EHR Record"
                  className="text-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)] p-2 rounded-lg transition-colors border border-transparent hover:border-[var(--color-outline-variant)]"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Transmitted Vitals Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
                    <Heart className="w-3.5 h-3.5 text-[var(--color-error)]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Heart Rate</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[var(--color-on-surface)]">78</span>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">bpm</span>
                  </div>
                </div>

                <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
                    <HeartPulse className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Blood Pressure</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[var(--color-on-surface)]">128/82</span>
                  </div>
                </div>

                <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
                    <Thermometer className="w-3.5 h-3.5 text-[var(--color-tertiary-container)]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Temperature</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[var(--color-on-surface)]">98.6</span>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">°F</span>
                  </div>
                </div>

                <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
                    <Wind className="w-3.5 h-3.5 text-[var(--color-on-tertiary-container)]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">SpO2</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[var(--color-on-surface)]">99</span>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">%</span>
                  </div>
                </div>
              </div>

              {/* Clinical Context & Records */}
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl flex flex-col shadow-sm flex-1 min-h-[260px]">
                <div className="flex items-center border-b border-[var(--color-outline-variant)] px-3 py-2.5 bg-[var(--color-surface-container-low)]">
                  <h4 className="text-xs font-bold text-[var(--color-on-surface)] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[var(--color-primary)]" />
                    Clinical Context & History
                  </h4>
                </div>

                <div className="p-3.5 flex flex-col gap-4 overflow-y-auto text-xs">
                  {/* Allergies */}
                  <div>
                    <h5 className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Allergies & Alerts</h5>
                    <div className="flex flex-wrap gap-1.5">
                      <div className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] font-semibold px-2 py-0.5 rounded border border-[var(--color-error)]/20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Penicillin (Severe)
                      </div>
                      <div className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] font-semibold px-2 py-0.5 rounded border border-[var(--color-outline-variant)]">
                        Latex (Mild)
                      </div>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <h5 className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Active Conditions</h5>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1 shrink-0"></div>
                        <div>
                          <p className="font-semibold text-[var(--color-on-surface)]">Type 2 Diabetes Mellitus</p>
                          <p className="text-[10px] text-[var(--color-on-surface-variant)]">Diagnosed: 2019</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1 shrink-0"></div>
                        <div>
                          <p className="font-semibold text-[var(--color-on-surface)]">Essential Hypertension</p>
                          <p className="text-[10px] text-[var(--color-on-surface-variant)]">Diagnosed: 2021</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Medications */}
                  <div>
                    <h5 className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Active Prescriptions</h5>
                    <div className="border border-[var(--color-outline-variant)] rounded-lg overflow-hidden divide-y divide-[var(--color-outline-variant)]">
                      <div className="p-2 bg-[var(--color-surface-bright)] flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-[var(--color-on-surface)]">Metformin HCL</p>
                          <p className="text-[10px] text-[var(--color-on-surface-variant)]">1000mg • BID w/ meals</p>
                        </div>
                        <Pill className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                      <div className="p-2 bg-[var(--color-surface-bright)] flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-[var(--color-on-surface)]">Lisinopril</p>
                          <p className="text-[10px] text-[var(--color-on-surface-variant)]">10mg • Daily AM</p>
                        </div>
                        <Pill className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}