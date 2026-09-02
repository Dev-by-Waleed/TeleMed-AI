"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Loader2, Trash2, UploadCloud } from "lucide-react";
import { uploadAvatarAction, removeAvatarAction } from "@/actions/account";

const FALLBACK_STYLE = { backgroundColor: "var(--color-primary)", color: "var(--color-surface-card)" };

export default function AvatarUpload({ avatarUrl, fallbackText }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    setMsg({ type: "", text: "" });
    const fd = new FormData();
    fd.set("avatar", file);
    const result = await uploadAvatarAction(null, fd);
    setUploading(false);
    if (result?.error) {
      setMsg({ type: "error", text: result.error });
    } else {
      setMsg({ type: "success", text: "Profile picture updated." });
      router.refresh();
    }
  }

  async function handleRemove() {
    setBusy(true);
    setMsg({ type: "", text: "" });
    const result = await removeAvatarAction();
    setBusy(false);
    if (result?.error) {
      setMsg({ type: "error", text: result.error });
    } else {
      setMsg({ type: "success", text: "Profile picture removed." });
      router.refresh();
    }
  }

  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="relative">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Profile"
              width={88}
              height={88}
              className="w-22 h-22 rounded-full object-cover border"
              style={{ borderColor: "var(--color-outline-variant)" }}
            />
          ) : (
            <div
              className="w-22 h-22 rounded-full flex items-center justify-center font-bold text-2xl border"
              style={FALLBACK_STYLE}
            >
              {(fallbackText || "U").substring(0, 2).toUpperCase()}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--color-surface-card)", borderColor: "var(--color-surface-card)" }}
            aria-label="Change profile picture"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-primary-dark)" }}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload photo
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50 ml-1"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Remove
            </button>
          )}
          <p className="text-[11px] max-w-[220px]" style={{ color: "var(--color-on-surface-variant)" }}>
            JPG, PNG, WEBP or GIF. 2 MB max.
          </p>
          {msg.text && (
            <p className={`text-xs font-medium ${msg.type === "error" ? "text-red-600" : "text-green-700"}`}>{msg.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}