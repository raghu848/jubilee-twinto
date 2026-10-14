"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/*
  One image, uploaded or cleared. Used for a post's cover and for every image
  block inside a post. Uploading goes through the same /api/upload route as the
  project galleries, so Cloudinary or the local folder is chosen in one place.
*/
export function ImageUpload({
  url,
  onChange,
  label = "Image",
  hint,
}: {
  url: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setBusy(true);
    setError("");

    const body = new FormData();
    body.append("files", files[0]);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) {
        setError("Upload failed. Try again, or sign in if your session has expired.");
        return;
      }

      const data = (await res.json()) as {
        uploaded: { url: string }[];
        rejected: { name: string; reason: string }[];
      };

      if (data.uploaded[0]) onChange(data.uploaded[0].url);
      else if (data.rejected[0]) setError(data.rejected[0].reason);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="text-[13px] text-stone">{label}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void upload(e.dataTransfer.files);
        }}
        className={`mt-1.5 flex flex-wrap items-center gap-5 border border-dashed p-4 transition-colors ${
          dragOver ? "border-red-primary bg-paper" : "border-hairline bg-white"
        }`}
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden border border-hairline bg-paper">
          {url ? (
            <Image src={url} alt="" fill sizes="112px" className="object-cover" />
          ) : (
            <span className="slot-hatch flex h-full w-full items-center justify-center text-[11px] text-stone">
              Empty
            </span>
          )}
        </div>

        <div className="min-w-[200px] flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="border border-hairline px-4 py-2 text-[14px] transition-colors hover:border-red-primary hover:text-red-primary disabled:cursor-progress disabled:opacity-60"
            >
              {busy ? "Uploading…" : url ? "Replace" : "Upload an image"}
            </button>

            {url && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[14px] text-stone transition-colors hover:text-red-primary"
              >
                Remove
              </button>
            )}
          </div>

          <p className="mt-2 truncate text-[13px] text-stone">
            {url || hint || "Drag a file here, or choose one. JPG, PNG or WebP."}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={(e) => void upload(e.target.files)}
          className="sr-only"
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[13px] text-red-primary">
          {error}
        </p>
      )}
    </div>
  );
}
