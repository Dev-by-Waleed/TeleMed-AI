'use client';

import React, { useActionState, useRef, useState } from 'react';
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
  RefreshCw,
  X,
} from 'lucide-react';
import { uploadReportAction, retrySummarizeAction } from '@/actions/reports';
import ReactMarkdown from 'react-markdown';

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
  const [retrying, setRetrying] = useState(null);
  const [retryError, setRetryError] = useState(null);
  const [reports, setReports] = useState(initialReports);
  const [overlay, setOverlay] = useState(null);

  const handleCopy = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUploadSubmit = async (fd) => {
    const res = await formAction(fd);
    if (res?.success) {
      setFile(null);
      const newReport = res.report;
      if (newReport) {
        setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
      }
      if (newReport?.ai_summary) {
        setOverlay(newReport);
      }
    }
  };

  const handleRetry = async (id) => {
    setRetrying(id);
    setRetryError(null);
    const result = await retrySummarizeAction(id);
    setRetrying(null);
    if (result?.error) {
      setRetryError(result.error);
    } else if (result?.report) {
      const updated = result.report;
      setReports((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, ...updated, ai_summary: updated.ai_summary ?? null } : r))
      );
      if (updated.ai_summary) {
        setOverlay(updated);
      }
    }
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

      {retryError && (
        <div role="alert" className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
          {retryError}
        </div>
      )}

      {state?.error && (
        <div role="alert" className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
          {state.error}
        </div>
      )}

      {state?.success && state?.aiError && (
        <div role="alert" className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 text-sm font-medium text-center">
          Your report was uploaded, but the AI summary could not be generated at this time. You can retry it below.
        </div>
      )}

      {state?.success && !state?.aiError && (
        <div role="alert" className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm font-medium text-center">
          Report uploaded and analyzed successfully!
        </div>
      )}

      {/* Upload form */}
      <form
        action={handleUploadSubmit}
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
      {reports.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
            Your Reports
          </h2>
          <div className="space-y-4">
            {reports.map((r) => (
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
                        <div className="text-sm text-[var(--color-on-surface)] leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_h1,_h2,_h3]:mt-2 [&_h1,_h2,_h3]:mb-1 [&_p]:mb-2">
                          <ReactMarkdown>{r.ai_summary}</ReactMarkdown>
                        </div>
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
                    <button
                      type="button"
                      onClick={() => handleRetry(r.id)}
                      disabled={retrying === r.id}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${retrying === r.id ? 'animate-spin' : ''}`} />
                      {retrying === r.id ? 'Retrying...' : 'Retry Analysis'}
                    </button>
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

      {/* Analysis result overlay */}
      {overlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setOverlay(null)}>
          <div
            className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-[var(--color-secondary)] p-2 rounded-lg text-[var(--color-primary)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[var(--color-foreground)] truncate">{overlay.title}</h2>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">AI Analysis Result</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOverlay(null)}
                className="shrink-0 text-[var(--color-on-surface-variant)] hover:text-[var(--color-foreground)]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 inline-flex">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> Analyzed
              </span>
            </div>

            <div className="overflow-y-auto">
              <p className="text-sm text-[var(--color-on-surface)] leading-relaxed whitespace-pre-wrap bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-4">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  }}
                >
                  {overlay.ai_summary}
                </ReactMarkdown>
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-[var(--color-outline-variant)]">
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                Informational AI summary — not a substitute for professional medical advice.
              </p>
              <button
                type="button"
                onClick={() => handleCopy(overlay.id, overlay.ai_summary)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied === overlay.id ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
