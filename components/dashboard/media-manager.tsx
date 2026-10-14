"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";

/*
  Photo and video manager for a project.

  Files are dropped or picked, sent to /api/upload, and appended to the list.
  Order is what the website uses — the first image is the card and page hero —
  so it can be changed by dragging a row or with the arrow buttons, which keeps
  reordering possible from the keyboard.

  The whole list rides along in a hidden input as JSON; the form's server
  action validates it before saving.
*/

type Props = {
  name: string;
  initial: MediaItem[];
};

export function MediaManager({ name, initial }: Props) {
  const [items, setItems] = useState<MediaItem[]>(initial);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const dragIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    setBusy(true);
    setErrors([]);

    const body = new FormData();
    for (const file of Array.from(fileList)) body.append("files", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Upload failed." }));
        setErrors([error ?? "Upload failed."]);
        return;
      }

      const data = (await res.json()) as {
        uploaded: { url: string; kind: "image" | "video"; name: string }[];
        rejected: { name: string; reason: string }[];
      };

      setItems((current) => [
        ...current,
        ...data.uploaded.map((u) => ({
          id: `m_${Math.random().toString(36).slice(2, 10)}`,
          url: u.url,
          kind: u.kind,
          alt: u.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " "),
        })),
      ]);

      if (data.rejected.length > 0) {
        setErrors(data.rejected.map((r) => `${r.name}: ${r.reason}`));
      }
    } catch {
      setErrors(["Could not reach the server. Check your connection and try again."]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    setItems((current) => {
      const next = [...current];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      return next;
    });
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          // Ignore a row being reordered — only handle files from the desktop.
          if (dragIndex.current === null) void upload(e.dataTransfer.files);
        }}
        className={`border border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-red-primary bg-white" : "border-hairline bg-white"
        }`}
      >
        <p className="text-[16px]">
          Drag photographs or video here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-red-primary underline underline-offset-4"
          >
            choose files
          </button>
        </p>
        <p className="mt-2 text-[14px] text-stone">
          JPG, PNG, WebP, AVIF, GIF, MP4, WebM or MOV. Up to 60 MB each.
        </p>
        {busy && (
          <p className="mt-3 inline-flex items-center gap-2 text-[14px] text-stone">
            <span
              className="spin block h-3.5 w-3.5 rounded-full border-[1.5px] border-current border-t-transparent"
              aria-hidden="true"
            />
            Uploading
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime"
          onChange={(e) => void upload(e.target.files)}
          className="sr-only"
        />
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="mt-4 space-y-1">
          {errors.map((e) => (
            <li key={e} className="text-[14px] text-red-primary">
              {e}
            </li>
          ))}
        </ul>
      )}

      {items.length === 0 ? (
        <p className="mt-5 text-[15px] text-stone">
          No media yet. The first image in this list becomes the project card and
          the page header.
        </p>
      ) : (
        <ul className="mt-5 border-t border-hairline">
          {items.map((item, i) => (
            <li
              key={item.id}
              draggable
              onDragStart={() => {
                dragIndex.current = i;
              }}
              onDragEnd={() => {
                dragIndex.current = null;
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (dragIndex.current !== null && dragIndex.current !== i) {
                  move(dragIndex.current, i);
                }
                dragIndex.current = null;
              }}
              className="flex cursor-grab items-start gap-4 border-b border-hairline py-4 active:cursor-grabbing"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden border border-hairline bg-paper">
                {item.kind === "video" ? (
                  <span className="flex h-full w-full items-center justify-center bg-ink/85 text-[12px] text-white">
                    Video
                  </span>
                ) : item.url ? (
                  <Image src={item.url} alt="" fill sizes="96px" className="object-cover" />
                ) : (
                  <span className="slot-hatch flex h-full w-full items-center justify-center text-[11px] text-stone">
                    Empty
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <label className="block text-[13px] text-stone" htmlFor={`alt-${item.id}`}>
                  Description {i === 0 && <span className="text-red-primary">· used as the cover</span>}
                </label>
                <input
                  id={`alt-${item.id}`}
                  value={item.alt}
                  onChange={(e) =>
                    setItems((current) =>
                      current.map((m) => (m.id === item.id ? { ...m, alt: e.target.value } : m)),
                    )
                  }
                  placeholder="What this photograph shows"
                  className="mt-1 w-full border-b border-hairline bg-transparent py-2 text-[15px] outline-none focus:border-red-primary"
                />
                <p className="mt-1.5 truncate text-[13px] text-stone">
                  {item.url || "No file yet — drop one above, then drag this row into place"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label={`Move ${item.alt || "item"} up`}
                  className="h-8 w-8 border border-hairline text-[14px] transition-colors hover:border-red-primary hover:text-red-primary disabled:opacity-30 disabled:hover:border-hairline disabled:hover:text-ink"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === items.length - 1}
                  aria-label={`Move ${item.alt || "item"} down`}
                  className="h-8 w-8 border border-hairline text-[14px] transition-colors hover:border-red-primary hover:text-red-primary disabled:opacity-30 disabled:hover:border-hairline disabled:hover:text-ink"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => setItems((current) => current.filter((m) => m.id !== item.id))}
                  aria-label={`Remove ${item.alt || "item"}`}
                  className="h-8 px-3 border border-hairline text-[14px] transition-colors hover:border-red-primary hover:text-red-primary"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
