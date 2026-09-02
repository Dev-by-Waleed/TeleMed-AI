'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  Search,
  Download,
  Trash2,
  Eye,
  FolderOpen,
} from 'lucide-react';
import { uploadReportAction, retrySummarizeAction, deleteReportAction, getReportDownloadUrl } from '@/actions/reports';
import { fmtDateShort, fmtRelativeTime } from '@/lib/date';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const STATUS_FILTERS = [
  { key: 'all', label: 'All', icon: null },
  { key: 'analyzed', label: 'Analyzed', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { key: 'uploaded', label: 'Processing', icon: <Clock className="w-3.5 h-3.5" /> },
  { key: 'failed', label: 'Failed', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

function statusMeta(status) {
  switch (status) {
    case 'analyzed':
      return {
        label: 'Analyzed',
        cls: 'bg-emerald-100 text-emerald-800',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      };
    case 'uploaded':
      return {
        label: 'Processing',
        cls: 'bg-amber-100 text-amber-800',
        icon: <Clock className="w-3.5 h-3.5" />,
      };
    default:
      return {
        label: 'Failed',
        cls: 'bg-red-100 text-red-800',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
  }
}

function StatusBadge({ status }) {
  const { label, cls, icon } = statusMeta(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      {icon} {label}
    </span>
  );
}

function ConfirmDeleteModal({ report, onConfirm, onCancel, busy }) {
  if (!report) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onCancel}
    >
      <div
        className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl max-w-md w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="bg-red-100 p-2.5 rounded-lg text-red-600 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--color-foreground)]">
              Delete this report?
            </h2>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              &ldquo;{report.title}&rdquo; and its stored PDF will be permanently removed. This
              action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {busy ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReportsClient({ initialReports = [] }) {
  const [state, setUploadState] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const [copied, setCopied] = useState(null);
  const [retrying, setRetrying] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [reports, setReports] = useState(initialReports);
  const [overlay, setOverlay] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleCopy = async (id, text) => {
    if (!text) {
      toast.error('No summary available to copy.');
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      textarea.remove();
      if (!ok) {
        toast.error('Could not copy. Please select and copy the text manually.');
        return;
      }
    }
    setCopied(id);
    toast.success('Summary copied to clipboard.');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUploadSubmit = async (fd) => {
    setUploading(true);
    const res = await uploadReportAction(null, fd);
    setUploading(false);
    setUploadState(res);
    if (res?.success) {
      setFile(null);
      const newReport = res.report;
      if (newReport) {
        setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
      }
      if (res?.aiError) {
        toast.success('Report uploaded. AI summary could not be generated — you can retry.');
      } else {
        toast.success('Report uploaded and analyzed successfully!');
      }
      if (newReport?.ai_summary) {
        setOverlay(newReport);
      }
    } else if (res?.error) {
      toast.error(res.error);
    }
  };

  const handleRetry = async (id) => {
    setRetrying(id);
    const result = await retrySummarizeAction(id);
    setRetrying(null);
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.report) {
      const updated = result.report;
      setReports((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, ...updated, ai_summary: updated.ai_summary ?? null } : r))
      );
      toast.success('Analysis complete!');
      if (updated.ai_summary) {
        setOverlay(updated);
      }
    }
  };

  const handleDownload = async (id) => {
    setDownloading(id);
    const result = await getReportDownloadUrl(id);
    setDownloading(null);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.title || 'report.pdf';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success('Download started.');
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteReportAction(deleteTarget.id);
    setDeleting(false);
    if (result?.error) {
      toast.error(result.error);
      setDeleteTarget(null);
      return;
    }
    setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success('Report deleted.');
  };

  const filtered = reports.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || (r.title || '').toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const counts = React.useMemo(() => {
    const c = { all: reports.length, analyzed: 0, uploaded: 0, failed: 0 };
    reports.forEach((r) => {
      if (c[r.status] !== undefined) c[r.status] += 1;
    });
    return c;
  }, [reports]);

  return (
    <main className="flex-1 p-4 md:p-10 max-w-[1200px] mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
          My Reports
        </h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">
          Upload and manage your laboratory reports with AI-assisted summaries.
        </p>
      </header>

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
            ? 'Click "Upload" to generate an AI summary.'
            : 'Click to browse your files. Supported format: PDF (Max 10 MB).'}
        </p>
        <button
          type="submit"
          disabled={uploading || !file}
          className="mt-4 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading &amp; Analyzing...
            </>
          ) : (
            'Upload & Analyze'
          )}
        </button>
      </form>

      {state?.success && (
        <div
          role="status"
          className={`mt-6 p-3 rounded-lg text-sm font-medium text-center ${
            state?.aiError
              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-700'
              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700'
          }`}
        >
          {state?.aiError
            ? 'Your report was uploaded, but the AI summary could not be generated at this time. You can retry it below.'
            : 'Report uploaded and analyzed successfully!'}
        </div>
      )}

      {reports.length > 0 && (
        <section className="mt-10">
          {/* Toolbar: search + filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-on-surface-variant)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-sm placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-1">
              {STATUS_FILTERS.map((f) => {
                const active = statusFilter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setStatusFilter(f.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-secondary)]'
                    }`}
                  >
                    {f.icon}
                    {f.label}
                    <span className={`ml-0.5 ${active ? 'text-white/80' : 'text-[var(--color-outline)]'}`}>
                      {counts[f.key] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[var(--color-foreground)]">
              {filtered.length} {filtered.length === 1 ? 'report' : 'reports'}
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-10 flex flex-col items-center text-center">
              <FolderOpen className="w-10 h-10 text-[var(--color-on-surface-variant)] mb-3" />
              <p className="text-sm font-semibold text-[var(--color-foreground)]">No reports found</p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((r) => {
                const isAnalyzed = r.status === 'analyzed';
                return (
                  <article
                    key={r.id}
                    className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 flex items-center gap-4">
                      <div className="bg-[var(--color-secondary)] p-2.5 rounded-lg text-[var(--color-primary)] shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>

                      <button
                        type="button"
                        onClick={() => isAnalyzed && r.ai_summary && setOverlay(r)}
                        className="flex-1 min-w-0 text-left"
                        title={isAnalyzed ? 'View summary' : undefined}
                      >
                        <h3 className="text-sm font-semibold text-[var(--color-foreground)] truncate">
                          {r.title}
                        </h3>
                        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 flex items-center gap-1.5">
                          <span>Uploaded {fmtDateShort(r.created_at)}</span>
                          <span aria-hidden="true">&middot;</span>
                          <span>{fmtRelativeTime(r.created_at)}</span>
                        </p>
                      </button>

                      <div className="hidden sm:block shrink-0">
                        <StatusBadge status={r.status} />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDownload(r.id)}
                          disabled={downloading === r.id}
                          aria-label="Download PDF"
                          title="Download original PDF"
                          className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
                        >
                          {downloading === r.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>

                        {isAnalyzed && r.ai_summary && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCopy(r.id, r.ai_summary)}
                              aria-label="Copy summary"
                              title="Copy summary"
                              className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                copied === r.id
                                  ? 'text-emerald-600 bg-emerald-50'
                                  : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                              }`}
                            >
                              {copied === r.id ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setOverlay(r)}
                              aria-label="View summary"
                              title="View summary"
                              className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {r.status === 'failed' && (
                          <button
                            type="button"
                            onClick={() => handleRetry(r.id)}
                            disabled={retrying === r.id}
                            aria-label="Retry analysis"
                            title="Retry analysis"
                            className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
                          >
                            <RefreshCw className={`w-4 h-4 ${retrying === r.id ? 'animate-spin' : ''}`} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(r)}
                          aria-label="Delete report"
                          title="Delete report"
                          className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Summary snippet */}
                    {isAnalyzed && r.ai_summary && (
                      <div className="px-4 pb-4">
                        <div className="flex items-start gap-3 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-3">
                          <div className="bg-[var(--color-secondary)] p-1.5 rounded-md text-[var(--color-primary)] shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-2">
                              <ReactMarkdown>{r.ai_summary}</ReactMarkdown>
                            </p>
                            <button
                              type="button"
                              onClick={() => setOverlay(r)}
                              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                            >
                              View full summary
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {reports.length === 0 && (
        <div className="mt-10 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-10 flex flex-col items-center text-center">
          <FolderOpen className="w-10 h-10 text-[var(--color-on-surface-variant)] mb-3" />
          <p className="text-sm font-semibold text-[var(--color-foreground)]">No reports yet</p>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 max-w-sm">
            Upload your first lab report above to get an easy-to-read AI summary.
          </p>
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

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        report={deleteTarget}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

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
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    AI Analysis Result
                  </p>
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
              <StatusBadge status={overlay.status || 'analyzed'} />
            </div>

            <div className="overflow-y-auto">
              <div className="text-sm text-[var(--color-on-surface)] leading-relaxed bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-4">
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
              </div>
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
