'use client';

import React, { useActionState, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  Info,
  Copy,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { uploadReportAction } from '@/actions/reports';

function statusBadge(status) {
  switch (status) {
    case 'analyzed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" /> Analyzed
        </span>
      );
    case 'uploaded':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
          <Clock className="w-3.5 h-3.5" /> Processing
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">
          <AlertTriangle className="w-3.5 h-3.5" /> Failed
        </span>
      );
  }
}

export default function ReportsClient({ initialReports = [] }) {
  const [state, formAction, isPending] = useActionState(uploadReportAction, null);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const [copied, setCopied] = useState(null);
  const router = useRouter();

  const handleCopy = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="flex-1 p-4 md:p-10 max-w-[1440px] mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
          My Reports
        </h1>
        <p className="text-base text-[var(--color-on-surface-variant)] mb-6">
          Upload and analyze laboratory reports using the AI Hub.
        </p>
      </header>

      {state?.error && (
        <div role="alert" className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
          {state.error}
        </div>
      )}

      {/* Upload form */}
      <form
        action={formAction}
        onSubmit={() => setFile(null)}
        className="w-full border-2 border-dashed border-[var(--color-primary)]/30 bg-[var(--color-surface)] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--color-secondary)]/50 hover:border-[var(--color-primary)]/60 transition-all duration-200 group"
      >
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-[var(--color-secondary)] p-3 rounded-full mb-3 text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-200"
          aria-label="Choose PDF"
        >
          <UploadCloud className="w-8 h-8" />
        </button>
        <h3 className="text-sm font-bold text-[var(--color-foreground)] mb-1">
          {file ? file.name : 'Upload PDF Lab Report'}
        </h3>
        <p className="text-xs text-[var(--color-on-surface-variant)] max-w-sm">
          {file
            ? 'Click "Analyze" to upload and generate an AI summary.'
            : 'Drag and drop your file here, or click to browse. Supported format: PDF (Max 10 MB).'}
        </p>
        <button
          type="submit"
          disabled={isPending || !file}
          className="mt-4 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading &amp; Analyzing...
            </>
          ) : (
            'Upload & Analyze'
          )}
        </button>
      </form>

      {/* Reports list */}
      {initialReports.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
            Your Reports
          </h2>
          <div className="space-y-4">
            {initialReports.map((r) => (
              <article key={r.id} className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[var(--color-outline-variant)] flex items-center gap-3 flex-wrap">
                  <div className="bg-[var(--color-secondary)] p-2.5 rounded-lg text-[var(--color-primary)]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--color-foreground)] truncate">{r.title}</h3>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">
                      Uploaded {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {statusBadge(r.status)}
                </div>

                {r.status === 'analyzed' && r.ai_summary ? (
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-[var(--color-secondary)] p-2 rounded-lg text-[var(--color-primary)] shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{r.ai_summary}</p>
                        <button
                          type="button"
                          onClick={() => handleCopy(r.id, r.ai_summary)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copied === r.id ? 'Copied!' : 'Copy Summary'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      {r.status === 'uploaded'
                        ? 'Your report is being processed. An AI summary will appear here shortly.'
                        : 'We could not generate a summary for this report.'}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-10 flex items-start gap-3 rounded-lg bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] p-4">
        <Info className="w-5 h-5 shrink-0 text-[var(--color-on-surface-variant)]" />
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
          <strong>Disclaimer:</strong> The AI summary is informational only and is generated by an
          automated model. It does not replace a doctor&apos;s professional opinion. Always review your
          results with a qualified healthcare provider.
        </p>
      </div>
    </main>
  );
}
