import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Pinyon_Script } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

// High-contrast display serif for headlines.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni",
});

// Grotesk for everything a person has to read or fill in.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Used for single accent words only — never for a phrase of any length.
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-script",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Real estate, built to live in`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — Real estate, built to live in`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${inter.variable} ${pinyon.variable}`}>
      <head>
        {/*
          Scroll reveals start at opacity 0 and are switched on by an observer.
          With scripting off that observer never runs, so the page would be
          almost entirely blank — this hands the content straight back.
        */}
        <noscript>
          <style>{`.reveal,.reveal-wipe{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
