import Link from "next/link";
import { SITE } from "@/lib/site";
import { listProjects } from "@/lib/store";

export async function SiteFooter() {
  const projects = await listProjects();

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1560px] px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="mt-0.5 h-[18px] w-[3px] bg-red-primary" />
              <span className="font-display text-[19px] leading-none">{SITE.name}</span>
            </div>
            <p className="measure-tight mt-5 text-[15px] leading-relaxed text-paper/60">
              {SITE.description}
            </p>
            <p className="mt-5 text-[13px] text-paper/40">
              {SITE.legalName} · Since {SITE.stats.yearFounded}
            </p>
          </div>

          <nav aria-label="Projects">
            <h2 className="label text-paper/45">Projects</h2>
            <ul className="mt-4 space-y-2.5">
              {projects.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="text-[15px] text-paper/85 transition-colors hover:text-red-primary"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/projects"
                  className="text-[15px] text-paper/50 transition-colors hover:text-red-primary"
                >
                  All projects
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="label text-paper/45">Company</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/about" className="text-[15px] text-paper/85 transition-colors hover:text-red-primary">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[15px] text-paper/85 transition-colors hover:text-red-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[15px] text-paper/85 transition-colors hover:text-red-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[15px] text-paper/85 transition-colors hover:text-red-primary">
                  Team login
                </Link>
              </li>
              {SITE.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-[15px] text-paper/85 transition-colors hover:text-red-primary"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label text-paper/45">Sales office</h2>
            <address className="mt-4 space-y-1 text-[15px] not-italic leading-relaxed text-paper/85">
              <p>{SITE.office.line1}</p>
              <p>{SITE.office.line2}</p>
              <p className="text-paper/60">{SITE.office.state}</p>
            </address>
            <div className="mt-5 space-y-1.5 text-[15px]">
              <p>
                <a href={SITE.phoneHref} className="transition-colors hover:text-red-primary">
                  {SITE.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-red-primary">
                  {SITE.email}
                </a>
              </p>
              <p className="text-paper/50">{SITE.hours}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-paper/15 pt-8">
          <p className="measure text-[13px] leading-relaxed text-paper/40">
            Renders, plans and dimensions on this site are indicative and subject to
            approval by the relevant authority. RERA registration numbers for each
            project are available on request and at the site office.
          </p>
          <p className="mt-4 text-[13px] text-paper/40">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
