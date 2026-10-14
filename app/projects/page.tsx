import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/project-card";
import { MarqueeLink } from "@/components/marquee-link";
import { RevealObserver } from "@/components/reveal-observer";
import { listProjects } from "@/lib/store";
import { PROJECT_STATUSES, PROJECT_TYPES, STATUS_LABEL, TYPE_LABEL } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Apartments, villas, plotted developments and commercial space across Hyderabad, Bengaluru, Vijayawada and Visakhapatnam.",
};

type Search = { type?: string; city?: string; status?: string };

/*
  Filters are URL state rather than component state: they survive a refresh,
  can be sent to a customer over WhatsApp, and work with JavaScript disabled.
*/
function FilterRow({
  label,
  options,
  active,
  paramKey,
  current,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string;
  paramKey: keyof Search;
  current: Search;
}) {
  const href = (value: string) => {
    const next = { ...current, [paramKey]: value };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v && v !== "all") params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/projects?${qs}` : "/projects";
  };

  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-4">
      <span className="label w-16 shrink-0 text-stone">{label}</span>
      {[{ value: "all", label: "All" }, ...options].map((option) => {
        const isActive = active === option.value;
        return (
          <Link
            key={option.value}
            href={href(option.value)}
            aria-current={isActive ? "true" : undefined}
            className={`border-b pb-0.5 text-[15px] transition-colors duration-300 ${
              isActive
                ? "border-red-primary text-red-primary"
                : "border-transparent text-ink hover:border-hairline hover:text-stone"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const current: Search = {
    type: params.type ?? "all",
    city: params.city ?? "all",
    status: params.status ?? "all",
  };

  const all = await listProjects();
  const cities = [...new Set(all.map((p) => p.city))].sort();

  const projects = all.filter((p) => {
    if (current.type !== "all" && p.type !== current.type) return false;
    if (current.city !== "all" && p.city !== current.city) return false;
    if (current.status !== "all" && p.status !== current.status) return false;
    return true;
  });

  return (
    <>
      <SiteHeader />

      <main id="main" className="pt-24 lg:pt-28">
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-[1560px] px-5 py-16 lg:px-8 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-20">
              <h1 className="text-[clamp(2.75rem,8vw,7rem)]">Projects</h1>
              <p className="measure text-[16px] leading-relaxed text-stone lg:text-[17px]">
                Everything we have under construction, ready to move into, or
                opening for sale shortly. Prices are indicative and exclude
                registration, GST and statutory charges.
              </p>
            </div>
          </div>
        </section>

        <section className="sticky top-[73px] z-30 border-b border-hairline bg-paper/95 backdrop-blur-md">
          <div className="mx-auto max-w-[1560px] divide-y divide-hairline px-5 lg:px-8">
            <FilterRow
              label="Type"
              paramKey="type"
              active={current.type!}
              current={current}
              options={PROJECT_TYPES.map((t) => ({ value: t, label: TYPE_LABEL[t] }))}
            />
            <FilterRow
              label="City"
              paramKey="city"
              active={current.city!}
              current={current}
              options={cities.map((c) => ({ value: c, label: c }))}
            />
            <FilterRow
              label="Status"
              paramKey="status"
              active={current.status!}
              current={current}
              options={PROJECT_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
            />
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <p className="label text-stone">
              {projects.length === 0
                ? "No projects match those filters"
                : `${projects.length} of ${all.length} projects`}
            </p>

            {projects.length === 0 ? (
              <div className="mt-10 border-t border-hairline pt-10">
                <p className="measure text-[clamp(1.3rem,2.4vw,1.9rem)] font-display leading-snug">
                  Nothing in our current inventory matches that combination.
                </p>
                <p className="measure mt-5 text-[16px] leading-relaxed text-stone">
                  Tell us what you are looking for and we will let you know when
                  something suitable launches.
                </p>
                <div className="mt-9">
                  <MarqueeLink href="/contact" label="Register your requirement" />
                </div>
              </div>
            ) : (
              <div className="mt-12 gap-x-12 md:columns-2 lg:columns-3">
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    className="reveal mb-16 break-inside-avoid"
                    style={{ ["--d" as string]: `${(i % 3) * 100}ms` }}
                  >
                    <ProjectCard project={project} priority={i < 3} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
      <RevealObserver />
    </>
  );
}
