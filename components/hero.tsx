"use client";

import Link from "next/link";
import { useState } from "react";
import { ImageSlot } from "@/components/image-slot";
import { SITE } from "@/lib/site";

/*
  The signature moment. One full-bleed frame, the headline set across three
  lines that rise in sequence on load, and a day/night switch that changes
  which photograph is showing — so the client needs to commission two hero
  images, one of each, and the site has something to do beyond sitting still.
*/
export function Hero({
  dayImage,
  nightImage,
  projectCount,
}: {
  dayImage?: string;
  nightImage?: string;
  projectCount: number;
}) {
  const [mode, setMode] = useState<"day" | "night">("day");
  const night = mode === "night";

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
      {/* Both frames stay mounted so the switch is a cross-fade, not a reload */}
      <div className="absolute inset-0">
        <div
          className={`enter-settle absolute inset-0 transition-opacity duration-[900ms] ${
            night ? "opacity-0" : "opacity-100"
          }`}
        >
          <ImageSlot
            src={dayImage}
            alt="Hero, by day — the flagship development seen wide, with sky above the towers"
            tone="dark"
            priority
            sizes="100vw"
            note="2400 × 1350 · landscape"
            caption="corner"
            className="h-full w-full"
          />
        </div>
        <div
          className={`enter-settle absolute inset-0 transition-opacity duration-[900ms] ${
            night ? "opacity-100" : "opacity-0"
          }`}
        >
          <ImageSlot
            src={nightImage}
            alt="Hero, by night — the same view after dark, windows lit"
            tone="dark"
            sizes="100vw"
            note="2400 × 1350 · landscape"
            caption="corner"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Legibility wash. Kept to the top and bottom so the middle stays clear. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/80"
      />

      <div className="relative mx-auto w-full max-w-[1560px] px-5 pb-8 pt-32 lg:pb-12 lg:pl-20 lg:pr-8">
        <h1 className="text-white">
          <span className="block overflow-hidden">
            <span className="enter-line block text-[clamp(3rem,11vw,10rem)]" style={{ ["--d" as string]: "150ms" }}>
              Real estate,
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="enter-line block text-[clamp(3rem,11vw,10rem)]"
              style={{ ["--d" as string]: "280ms" }}
            >
              built to{" "}
              <span className="script text-red-primary [font-size:1.15em] [line-height:0.8]">
                live in
              </span>
            </span>
          </span>
        </h1>

        <div className="enter mt-10 grid gap-8 border-t border-white/20 pt-7 lg:grid-cols-[1fr_auto_1fr] lg:items-center" style={{ ["--d" as string]: "620ms" }}>
          <p className="measure text-[15px] leading-relaxed text-white/70 lg:text-[16px]">
            Apartments, villas, plotted land and offices across South India — from
            a developer that hands over on the date written into the agreement.
          </p>

          {/* Day / night switch */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMode("day")}
              aria-pressed={!night}
              className={`label py-2 transition-colors ${night ? "text-white/40 hover:text-white/70" : "text-white"}`}
            >
              By day
            </button>
            <span
              className="relative h-5 w-11 shrink-0 cursor-pointer rounded-full border border-white/35"
              onClick={() => setMode(night ? "day" : "night")}
              aria-hidden="true"
            >
              <span
                className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white transition-[left] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  night ? "left-[26px]" : "left-[6px]"
                }`}
              />
            </span>
            <button
              type="button"
              onClick={() => setMode("night")}
              aria-pressed={night}
              className={`label py-2 transition-colors ${night ? "text-white" : "text-white/40 hover:text-white/70"}`}
            >
              By night
            </button>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 lg:justify-end">
            <p className="label text-white/50">
              {projectCount} projects · {SITE.cities.length} cities
            </p>
            <Link
              href="/projects"
              className="label group inline-flex items-center gap-3 border-b border-white/40 pb-1 text-white transition-colors hover:border-red-primary hover:text-red-primary"
            >
              Explore projects
              <span className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="enter pointer-events-none absolute bottom-8 left-5 hidden flex-col items-center gap-3 lg:flex lg:left-8"
        style={{ ["--d" as string]: "900ms" }}
        aria-hidden="true"
      >
        <span className="label rotate-180 text-white/45 [writing-mode:vertical-rl]">Scroll</span>
        <span className="drift block h-10 w-px bg-white/40" />
      </div>
    </section>
  );
}
