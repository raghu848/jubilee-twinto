"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { ImageSlot } from "@/components/image-slot";

/** Rotating seal — the small piece of craft that sits in the corner. */
function Seal({ tone }: { tone: "light" | "dark" }) {
  return (
    <span className="relative block h-11 w-11 shrink-0">
      <svg viewBox="0 0 100 100" className="spin-slow h-full w-full" aria-hidden="true">
        <defs>
          <path id="seal-path" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" />
        </defs>
        <text
          fontSize="10.5"
          letterSpacing="2.6"
          fill="currentColor"
          className={tone === "dark" ? "text-white/60" : "text-ink/55"}
        >
          <textPath href="#seal-path" startOffset="0">
            JUBILEE SALES · SINCE 2009 · HYDERABAD ·
          </textPath>
        </text>
      </svg>
      <span
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-red-primary"
        aria-hidden="true"
      />
    </span>
  );
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the overlay, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Over the hero the bar is transparent with light type; everywhere else, and
  // once the reader scrolls, it takes the paper background.
  const onImage = overlay && !scrolled;
  const barText = onImage ? "text-white" : "text-ink";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          onImage ? "bg-transparent" : "border-b border-hairline bg-paper/90 backdrop-blur-md"
        }`}
      >
        <div className={`mx-auto flex max-w-[1560px] items-center gap-6 px-5 py-4 lg:px-8 ${barText}`}>
          <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
            <Seal tone={onImage ? "dark" : "light"} />
            <span className="font-display text-[17px] leading-none tracking-tight sm:text-[19px]">
              {SITE.name}
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-6">
            <a
              href={SITE.phoneHref}
              className={`label hidden transition-opacity hover:opacity-60 sm:block ${
                onImage ? "text-white/85" : "text-stone"
              }`}
            >
              {SITE.phone}
            </a>

            <Link
              href="/contact"
              className={`label hidden px-6 py-3 transition-colors duration-300 md:block ${
                onImage
                  ? "bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-ink"
                  : "bg-red-primary text-white hover:bg-red-deep"
              }`}
            >
              Enquire
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="label flex items-center gap-3 py-2"
            >
              Menu
              <span className="flex flex-col gap-[5px]" aria-hidden="true">
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-6 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------ fullscreen menu -- */}
      <div
        className={`fixed inset-0 z-[60] bg-ink text-paper transition-[opacity,visibility] duration-500 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <div className="mx-auto flex h-full max-w-[1560px] flex-col px-5 py-4 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-3 text-paper">
              <Seal tone="dark" />
              <span className="font-display text-[17px] leading-none sm:text-[19px]">{SITE.name}</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="label ml-auto flex items-center gap-3 py-2"
            >
              Close
              <span className="relative block h-4 w-4" aria-hidden="true">
                <span className="absolute top-1/2 block h-px w-4 rotate-45 bg-current" />
                <span className="absolute top-1/2 block h-px w-4 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
            <nav aria-label="Main">
              <ul>
                {NAV_LINKS.map((link, i) => (
                  <li key={link.href} className="overflow-hidden border-b border-white/12">
                    <Link
                      href={link.href}
                      className="group flex items-baseline gap-6 py-4 lg:py-6"
                      style={{ ["--d" as string]: `${80 + i * 70}ms` }}
                    >
                      <span className="label w-8 shrink-0 text-white/35">
                        0{i + 1}
                      </span>
                      <span
                        className={`font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-none transition-all duration-500 group-hover:translate-x-3 group-hover:text-red-primary ${
                          open ? "enter-line" : "opacity-0"
                        }`}
                        style={{ ["--d" as string]: `${120 + i * 80}ms` }}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                <div>
                  <p className="label text-white/40">Sales desk</p>
                  <p className="mt-2 text-[17px]">
                    <a href={SITE.phoneHref} className="link-underline pb-0.5">
                      {SITE.phone}
                    </a>
                  </p>
                  <p className="mt-1 text-[15px]">
                    <a href={`mailto:${SITE.email}`} className="text-white/60 hover:text-red-primary">
                      {SITE.email}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="label text-white/40">Head office</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/75">
                    {SITE.office.line1}
                    <br />
                    {SITE.office.line2}
                  </p>
                </div>
                <div>
                  <p className="label text-white/40">Follow</p>
                  <ul className="mt-2 space-y-1">
                    {SITE.social.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] text-white/75 hover:text-red-primary"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>

            <div className="hidden lg:block">
              <ImageSlot
                alt="Menu panel image — a single strong exterior, portrait crop"
                aspect="aspect-[4/5]"
                tone="dark"
                note="1200 × 1500"
                sizes="30vw"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
