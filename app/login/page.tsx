import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/dashboard/login-form";
import { getSession, hasConfiguredAccounts, usingDevAccount, DEV_ACCOUNT_HINT } from "@/lib/auth";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Team login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <main id="main" className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col px-6 py-8 lg:px-10">
        <Link href="/" className="flex w-fit items-baseline gap-2.5">
          <span className="mt-0.5 h-[18px] w-[3px] bg-red-primary" />
          <span className="font-display text-[19px] leading-none">{SITE.name}</span>
        </Link>

        <div className="flex flex-1 items-center">
          <div className="w-full max-w-[420px]">
            <h1 className="text-[clamp(2.25rem,5vw,3.25rem)]">Team login</h1>
            <p className="measure-tight mt-4 text-[16px] leading-relaxed text-stone">
              For the {SITE.name} team only. Manage projects, upload photographs and
              read the enquiries coming in from the website.
            </p>

            <div className="mt-10">
              <LoginForm />
            </div>

            {!hasConfiguredAccounts() && (
              <p className="mt-8 border-l-2 border-red-primary py-1 pl-4 text-[14px] leading-relaxed text-stone">
                No team accounts are configured. Set{" "}
                <code className="text-ink">JUBILEE_TEAM_ACCOUNTS</code> in your
                environment before deploying — logins are refused in production
                until you do.
              </p>
            )}

            {usingDevAccount() && (
              <p className="mt-8 border-l-2 border-hairline py-1 pl-4 text-[14px] leading-relaxed text-stone">
                Development login: <code className="text-ink">{DEV_ACCOUNT_HINT.email}</code>{" "}
                / <code className="text-ink">{DEV_ACCOUNT_HINT.password}</code>. This
                account does not exist once <code className="text-ink">NODE_ENV</code>{" "}
                is production.
              </p>
            )}

            <p className="mt-10 text-[15px]">
              <Link href="/" className="link-underline pb-0.5 text-stone">
                ← Back to the website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
