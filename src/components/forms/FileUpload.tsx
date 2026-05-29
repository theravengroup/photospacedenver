"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

/**
 * Uploads the chosen file directly to private Vercel Blob and mirrors the
 * resolved URL into a hidden input (named `name`) so it rides along in FormData
 * and lands in the staff email. The parent form should confirm the hidden value
 * is present before submitting (a hidden input can't be browser-validated).
 */
type UploadState = "idle" | "uploading" | "done" | "error";

const FIELD =
  "w-full rounded-card border border-hairline bg-transparent px-4 py-2.5 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-panel file:px-4 file:py-1.5 file:text-sm file:text-foreground outline-none transition-colors focus:border-tungsten";

export function FileUpload({
  label,
  name,
  required,
  accept = "image/jpeg,image/png,image/heic,image/webp,application/pdf",
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  accept?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setState("uploading");
    setError("");
    setUrl("");
    setFileName(file.name);
    try {
      const blob = await upload(file.name, file, {
        access: "private",
        handleUploadUrl: "/api/blob/upload",
        contentType: file.type || undefined,
      });
      setUrl(blob.url);
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  }

  return (
    <div className="block">
      <span className="mb-1.5 block text-sm text-muted">
        {label}
        {required && <span className="text-tungsten"> *</span>}
      </span>
      <input type="file" accept={accept} required={required} onChange={onChange} className={FIELD} />
      <input type="hidden" name={name} value={url} readOnly />
      {hint && state === "idle" && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {state === "uploading" && <span className="mt-1 block text-xs text-muted">Uploading {fileName}…</span>}
      {state === "done" && <span className="mt-1 block text-xs text-tungsten">Uploaded ✓ {fileName}</span>}
      {state === "error" && (
        <span role="alert" className="mt-1 block text-xs text-studio-red">
          {error}
        </span>
      )}
    </div>
  );
}
