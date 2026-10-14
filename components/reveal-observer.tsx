"use client";

import { useEffect } from "react";

/*
  One observer for the whole page.

  Server components mark themselves up with `className="reveal"` (or
  `reveal-wipe`) and an optional `--d` delay; this mounts once, watches them
  all, and adds `is-in` as each arrives. That keeps every section a server
  component instead of wrapping each one in its own client boundary.
*/
export function RevealObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal, .reveal-wipe");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          /*
            A jump — an in-page anchor, a restored scroll position, a fast
            flick — can carry an element from below the viewport to above it
            without it ever intersecting. Those would stay invisible forever,
            so anything now sitting above the fold counts as arrived.
          */
          const scrolledPast = entry.boundingClientRect.bottom < 0;
          if (!entry.isIntersecting && !scrolledPast) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
