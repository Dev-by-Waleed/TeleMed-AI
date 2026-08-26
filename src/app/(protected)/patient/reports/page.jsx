'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Bell,
  UploadCloud,
  FileText,
  ZoomIn,
  ZoomOut,
  Sparkles,
  CheckCircle2,
  Info,
  Copy,
  Send,
} from 'lucide-react';

export default function PatientReports() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Patient-Friendly Overview: Your recent Comprehensive Metabolic Panel shows generally excellent results. Your liver and kidney functions are well within normal ranges, indicating good overall organ health. There is one minor area to monitor regarding your fasting glucose level.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased flex flex-col">  
      {/* Main Content Canvas */}
      <main className="flex-1 p-4 md:p-10 max-w-[1440px] mx-auto w-full">
        {/* Header & Drag and Drop Upload Section */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
            Patient Reports
          </h1>
          <p className="text-base text-[var(--color-on-surface-variant)] mb-6">
            Upload and analyze laboratory reports using the AI Hub.
          </p>

          <div className="w-full border-2 border-dashed border-[var(--color-primary)]/30 bg-[var(--color-surface)] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--color-secondary)]/50 hover:border-[var(--color-primary)]/60 transition-all duration-200 group">
            <div className="bg-[var(--color-secondary)] p-3 rounded-full mb-3 text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-200">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-[var(--color-foreground)] mb-1">
              Upload PDF Lab Report
            </h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] max-w-sm">
              Drag and drop your file here, or click to browse. Supported formats: PDF, JPEG, PNG (Max 10MB).
            </p>
          </div>
        </header>

        {/* Analysis Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] mb-8">
          
          {/* Left Column: PDF Viewer Preview */}
          <section className="lg:col-span-7 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-2.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--color-outline)]" />
                <span className="text-sm font-semibold text-[var(--color-foreground)] truncate max-w-xs sm:max-w-md">
                  Comprehensive_Metabolic_Panel_Doe_J.pdf
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label="Zoom out"
                  className="p-1.5 text-[var(--color-outline)] hover:text-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Zoom in"
                  className="p-1.5 text-[var(--color-outline)] hover:text-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[var(--color-background)]/60 p-6 flex items-center justify-center overflow-auto relative min-h-[400px]">
              {/* Faux PDF Document Render */}
              <div className="bg-[var(--color-surface-card)] w-full max-w-[480px] aspect-[1/1.4] shadow-md border border-[var(--color-outline-variant)]/50 p-8 flex flex-col gap-4 rounded-sm">
                <div className="border-b border-[var(--color-outline-variant)]/30 pb-4 mb-2 flex justify-between items-start">
                  <div>
                    <div className="w-32 h-4 bg-[var(--color-outline-variant)]/40 rounded mb-2" />
                    <div className="w-24 h-3 bg-[var(--color-outline-variant)]/30 rounded" />
                  </div>
                  <div className="w-12 h-12 bg-[var(--color-outline-variant)]/30 rounded-full" />
                </div>

                {/* Mocked Rows */}
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-[var(--color-outline-variant)]/20 pb-2">
                    <div className="w-1/3 h-3 bg-[var(--color-outline-variant)]/30 rounded" />
                    <div className="w-1/4 h-3 bg-[var(--color-primary-fixed-dim)] rounded" />
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-outline-variant)]/20 pb-2">
                    <div className="w-2/5 h-3 bg-[var(--color-outline-variant)]/30 rounded" />
                    <div className="w-1/5 h-3 bg-[var(--color-outline-variant)]/30 rounded" />
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-outline-variant)]/20 pb-2">
                    <div className="w-1/3 h-3 bg-[var(--color-outline-variant)]/30 rounded" />
                    <div className="w-1/4 h-3 bg-[var(--color-outline-variant)]/30 rounded" />
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-outline-variant)]/20 pb-2">
                    <div className="w-1/2 h-3 bg-[var(--color-outline-variant)]/30 rounded" />
                    <div className="w-1/6 h-3 bg-red-200 rounded" />
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-outline-variant)]/20 pb-2">
                    <div className="w-1/3 h-3 bg-[var(--color-outline-variant)]/30 rounded" />
                    <div className="w-1/4 h-3 bg-[var(--color-outline-variant)]/30 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: AI Summary Panel */}
          <section className="lg:col-span-5 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden flex flex-col shadow-sm relative">
            {/* Decorative Top Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] absolute top-0 left-0" />

            <div className="p-6 border-b border-[var(--color-outline-variant)] flex items-start gap-4 pt-7">
              <div className="bg-[var(--color-secondary)] p-2.5 rounded-lg text-[var(--color-primary)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
                  AI Simple Summary
                </h2>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                  Generated for Jane Doe • Today, 10:45 AM
                </p>
              </div>
            </div>

            {/* Scrollable Summary Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              <div className="bg-[var(--color-secondary)]/50 border border-[var(--color-outline-variant)]/50 p-4 rounded-lg">
                <p className="text-sm text-[var(--color-foreground)] leading-relaxed">
                  <strong className="text-sm font-semibold text-[var(--color-primary)]">
                    Patient-Friendly Overview:{' '}
                  </strong>
                  Your recent Comprehensive Metabolic Panel shows generally excellent results. Your liver and kidney functions are well within normal ranges, indicating good overall organ health. There is one minor area to monitor regarding your fasting glucose level.
                </p>
              </div>

              {/* Key Normal Findings */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Normal Findings
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-on-surface-variant)] pl-6 list-disc marker:text-[var(--color-primary)]">
                  <li>
                    <strong>Kidney Function (BUN/Creatinine):</strong> Normal. Kidneys are filtering waste effectively.
                  </li>
                  <li>
                    <strong>Liver Enzymes (AST/ALT):</strong> Normal. No signs of liver stress or inflammation.
                  </li>
                  <li>
                    <strong>Electrolytes (Sodium/Potassium):</strong> Balanced, indicating good hydration.
                  </li>
                </ul>
              </div>

              {/* Areas for Attention */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-red-600" />
                  Areas for Attention
                </h3>
                <div className="border border-red-200 bg-red-50/50 rounded-lg p-4 flex gap-3 items-start">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-red-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-foreground)]">
                      Fasting Glucose: <span className="text-red-600 font-bold">105 mg/dL</span> (Slightly Elevated)
                    </h4>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 leading-relaxed">
                      Normal range is typically below 99 mg/dL. This is considered &quot;prediabetes&quot; range, but a single test isn&apos;t definitive. It&apos;s recommended to discuss dietary adjustments with Dr. Smith.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="p-4 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface)] flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 bg-[var(--color-surface-card)] text-[var(--color-primary)] border border-[var(--color-outline-variant)] rounded-lg text-sm font-semibold hover:bg-[var(--color-secondary)] transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Share with Patient
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}