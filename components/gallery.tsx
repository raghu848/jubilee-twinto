"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageSlot } from "@/components/image-slot";
import type { MediaItem } from "@/lib/types";

/*
  Gallery with a lightbox. Motion is interaction-driven only — nothing advances
  on its own. Arrow keys move between frames once the lightbox is open, and
  Escape closes it.
*/
export function Gallery({
  items,
  aspect = "aspect-[16/10]",
}: {
  items: MediaItem[];
  aspect?: string;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const count = items.length;
  const step = useCallback(
    (by: number) => setIndex((i) => (i + by + count) % count),
    [count],
  );

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  if (count === 0) {
    return (
      <ImageSlot
        alt="Photography for this project is being added"
        aspect={aspect}
        note="Upload from the dashboard"
      />
    );
  }

  const active = items[Math.min(index, count - 1)];

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group block w-full text-left"
        aria-label={`Open ${active.alt} full screen`}
      >
        <div className="relative">
          <ImageSlot
            src={active.url || undefined}
            alt={active.alt}
            kind={active.kind}
            aspect={aspect}
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <span className="label absolute bottom-4 right-4 bg-ink/75 px-4 py-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View full screen
          </span>
        </div>
      </button>

      <div className="mt-4 flex items-start justify-between gap-6">
        <p className="text-[14px] leading-relaxed text-stone">{active.alt}</p>
        <p className="label shrink-0 text-stone tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      </div>

      {count > 1 && (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index}
              aria-label={`Show ${item.alt}`}
              className={`h-16 w-24 shrink-0 border transition-colors duration-300 ${
                i === index ? "border-red-primary" : "border-hairline hover:border-stone"
              }`}
            >
              <ImageSlot
                src={item.url || undefined}
                alt=""
                kind={item.kind}
                className="h-full w-full"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* --------------------------------------------------- lightbox -- */}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-ink/97"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery"
        >
          <div className="flex items-center justify-between px-5 py-4 lg:px-8">
            <p className="label text-white/60 tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              autoFocus
              className="label flex items-center gap-3 text-white"
            >
              Close
              <span className="relative block h-4 w-4" aria-hidden="true">
                <span className="absolute top-1/2 block h-px w-4 rotate-45 bg-current" />
                <span className="absolute top-1/2 block h-px w-4 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <div className="flex flex-1 items-center gap-4 px-4 pb-4 lg:gap-8 lg:px-8">
            {count > 1 && (
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous"
                className="shrink-0 border border-white/25 px-4 py-6 text-white transition-colors hover:border-red-primary hover:text-red-primary"
              >
                ←
              </button>
            )}

            <div className="flex-1">
              <ImageSlot
                src={active.url || undefined}
                alt={active.alt}
                kind={active.kind}
                tone="dark"
                aspect="aspect-[16/9]"
                sizes="90vw"
              />
              <p className="mt-4 text-center text-[14px] text-white/60">{active.alt}</p>
            </div>

            {count > 1 && (
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next"
                className="shrink-0 border border-white/25 px-4 py-6 text-white transition-colors hover:border-red-primary hover:text-red-primary"
              >
                →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
