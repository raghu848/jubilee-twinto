import Link from "next/link";
import { requireSession, hasConfiguredAccounts } from "@/lib/auth";
import { usingPostgres } from "@/lib/store";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await requireSession();

  const mediaStore =
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET
      ? `Cloudinary (${process.env.CLOUDINARY_CLOUD_NAME})`
      : "public/uploads — local only, not suitable for a live site";

  const rows = [
    { label: "Signed in as", value: session.email },
    { label: "Team accounts", value: hasConfiguredAccounts() ? "Configured" : "Not configured" },
    { label: "Database", value: usingPostgres ? "Postgres" : ".data/ JSON files — local only" },
    { label: "Media storage", value: mediaStore },
  ];

  return (
    <div>
      <h1 className="text-[clamp(2rem,4vw,3rem)]">Settings</h1>
      <p className="measure mt-3 text-[16px] leading-relaxed text-stone">
        How this installation is currently configured.
      </p>

      <dl className="mt-10 max-w-[720px] border-t border-hairline">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-wrap justify-between gap-x-8 gap-y-1 border-b border-hairline py-4"
          >
            <dt className="text-[15px] text-stone">{row.label}</dt>
            <dd className="text-[15px]">{row.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-14 max-w-[720px]">
        <h2 className="text-[26px]">Changing who can sign in</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-stone">
          Accounts are held in the{" "}
          <code className="text-ink">JUBILEE_TEAM_ACCOUNTS</code> environment
          variable, as a comma-separated list of{" "}
          <code className="text-ink">email:password</code> pairs. Adding or
          removing a colleague means editing that variable in your hosting
          dashboard and redeploying — there is no user table to maintain, and no
          way for a visitor to create an account.
        </p>
        <p className="mt-4 text-[16px] leading-relaxed text-stone">
          Sessions last twelve hours and are signed with{" "}
          <code className="text-ink">JUBILEE_SESSION_SECRET</code>. Changing that
          secret signs everyone out.
        </p>
      </section>

      <section className="mt-12 max-w-[720px]">
        <h2 className="text-[26px]">Company details on the website</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-stone">
          The phone number, email address, office address and opening hours shown
          in the header, footer and contact page come from{" "}
          <code className="text-ink">lib/site.ts</code>. They are in one file so a
          change reaches every page at once.
        </p>
        <p className="mt-4 text-[15px] text-stone">
          Currently: {SITE.phone} · {SITE.email} · {SITE.office.line2}
        </p>
      </section>

      <section className="mt-12 max-w-[720px]">
        <h2 className="text-[26px]">Email alerts for new enquiries</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-stone">
          Not built. Every enquiry is stored and visible in the{" "}
          <Link href="/dashboard/leads" className="text-red-primary link-underline pb-0.5">
            leads inbox
          </Link>{" "}
          straight away — an emailed copy was listed as a later phase in the
          brief, and hooks into the same place leads are written.
        </p>
      </section>
    </div>
  );
}
