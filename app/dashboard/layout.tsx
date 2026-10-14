import Link from "next/link";
import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { logout } from "@/app/login/actions";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SITE } from "@/lib/site";
import { usingPostgres } from "@/lib/store";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s — Jubilee Sales dashboard" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Guards every page under /dashboard. Mutating actions check again on their
  // own, so a stale tab cannot write after the session expires.
  const session = await requireSession();

  return (
    <div className="min-h-screen">
      <header className="border-b border-hairline bg-white">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-8 gap-y-4 px-6 py-4 lg:px-10">
          <Link href="/dashboard" className="flex items-baseline gap-2.5">
            <span className="mt-0.5 h-[18px] w-[3px] bg-red-primary" />
            <span className="font-display text-[19px] leading-none">{SITE.name}</span>
            <span className="text-[15px] text-stone">Dashboard</span>
          </Link>

          <div className="ml-auto flex items-center gap-6">
            <Link href="/" className="text-[14px] text-stone transition-colors hover:text-ink">
              View website
            </Link>
            <span className="hidden text-[14px] text-stone sm:inline">{session.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="border border-hairline px-4 py-2 text-[14px] transition-colors hover:border-red-primary hover:text-red-primary"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <DashboardNav />
      </header>

      {!usingPostgres && (
        <div className="border-b border-hairline bg-white">
          <div className="mx-auto max-w-[1360px] px-6 py-3 lg:px-10">
            <p className="text-[13px] leading-relaxed text-stone">
              Running on the local JSON store in{" "}
              <code className="text-ink">.data/</code>. Set{" "}
              <code className="text-ink">DATABASE_URL</code> and run{" "}
              <code className="text-ink">npm run db:init</code> to switch to
              Postgres — nothing else changes.
            </p>
          </div>
        </div>
      )}

      <main id="main" className="mx-auto max-w-[1360px] px-6 py-10 lg:px-10 lg:py-14">
        {children}
      </main>
    </div>
  );
}
