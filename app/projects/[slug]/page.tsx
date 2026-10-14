import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Gallery } from "@/components/gallery";
import { EnquiryForm } from "@/components/enquiry-form";
import { ImageSlot } from "@/components/image-slot";
import { MarqueeLink } from "@/components/marquee-link";
import { RevealObserver } from "@/components/reveal-observer";
import { getProjectBySlug, listProjects } from "@/lib/store";
import { STATUS_LABEL, TYPE_LABEL } from "@/lib/types";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.name}, ${project.locality}`,
    description: project.tagline,
    openGraph: { title: project.name, description: project.tagline },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await listProjects();
  const others = all.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <>
      <SiteHeader overlay />

      <main id="main">
        {/* ------------------------------------------------ project hero -- */}
        <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-ink">
          <div className="enter-settle absolute inset-0">
            <ImageSlot
              src={project.heroImage || undefined}
              alt={project.gallery[0]?.alt ?? `${project.name} — lead image`}
              tone="dark"
              priority
              sizes="100vw"
              note="2400 × 1350 · landscape"
              caption="corner"
              className="h-full w-full"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/10 to-ink/85"
          />

          <div className="relative mx-auto w-full max-w-[1560px] px-5 pb-10 pt-32 lg:px-8 lg:pb-16">
            <p className="enter label text-white/70" style={{ ["--d" as string]: "80ms" }}>
              {project.locality}, {project.city} · {TYPE_LABEL[project.type]} ·{" "}
              {STATUS_LABEL[project.status]}
            </p>

            <h1 className="mt-5 overflow-hidden text-white">
              <span className="enter-line block text-[clamp(2.75rem,9vw,8rem)]" style={{ ["--d" as string]: "160ms" }}>
                {project.name}
              </span>
            </h1>

            <div
              className="enter mt-9 grid gap-6 border-t border-white/20 pt-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
              style={{ ["--d" as string]: "440ms" }}
            >
              <p className="measure text-[16px] leading-relaxed text-white/75 lg:text-[17px]">
                {project.tagline}
              </p>
              <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] text-white lg:text-right">
                {project.priceFrom === "On request" ? "Pricing on request" : `From ${project.priceFrom}`}
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- key facts -- */}
        <section className="border-b border-hairline py-14 lg:py-20">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <dl className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {project.specs.slice(0, 4).map((spec, i) => (
                <div key={spec.label} className="reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
                  <dt className="label text-stone">{spec.label}</dt>
                  <dd className="mt-3 font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-none">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------------------------------- gallery -- */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <div className="reveal-wipe">
              <Gallery items={project.gallery} aspect="aspect-[16/9]" />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ detail -- */}
        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
              <div>
                <h2 className="reveal text-[clamp(1.75rem,3.5vw,2.75rem)]">About this project</h2>
                <p className="reveal measure mt-7 text-[17px] leading-relaxed text-ink/85">
                  {project.description}
                </p>

                <h2 className="reveal mt-20 text-[clamp(1.75rem,3.5vw,2.75rem)]">
                  Configurations and floor plans
                </h2>
                <ul className="mt-8 border-t border-hairline">
                  {project.configurations.map((config, i) => (
                    <li
                      key={config}
                      className="reveal flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline py-5"
                      style={{ ["--d" as string]: `${i * 70}ms` }}
                    >
                      <span className="font-display text-[clamp(1.2rem,2vw,1.6rem)]">{config}</span>
                      <a href="#enquire" className="label text-red-primary link-underline pb-0.5">
                        Request the floor plan
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="measure mt-5 text-[14px] leading-relaxed text-stone">
                  Dimensioned floor plates and the unit-wise price sheet are shared
                  by email on request, and are available to view at the site office.
                </p>

                <h2 className="reveal mt-20 text-[clamp(1.75rem,3.5vw,2.75rem)]">Specification</h2>
                <dl className="reveal mt-8 grid gap-x-12 gap-y-7 border-t border-hairline pt-8 sm:grid-cols-2">
                  {project.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="label text-stone">{spec.label}</dt>
                      <dd className="mt-2 text-[18px]">{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <h2 className="reveal mt-20 text-[clamp(1.75rem,3.5vw,2.75rem)]">
                  {project.type === "plots" ? "In the layout" : "In the development"}
                </h2>
                <ul className="reveal mt-8 grid gap-x-12 gap-y-4 sm:grid-cols-2">
                  {project.amenities.map((amenity) => (
                    <li key={amenity} className="flex gap-4 text-[16px] leading-relaxed">
                      <span className="mt-3 h-px w-5 shrink-0 bg-red-primary" aria-hidden="true" />
                      {amenity}
                    </li>
                  ))}
                </ul>

                <div className="reveal mt-20 border-t border-hairline pt-8">
                  <h2 className="text-[clamp(1.3rem,2vw,1.6rem)]">Approvals</h2>
                  <p className="measure mt-4 text-[16px] leading-relaxed text-stone">
                    {project.reraId
                      ? `RERA registration ${project.reraId}.`
                      : "The RERA registration number for this project is available on request and is displayed at the site office."}{" "}
                    Renders and dimensions on this page are indicative and subject to
                    approval by the relevant authority.
                  </p>
                </div>
              </div>

              <div>
                <div className="lg:sticky lg:top-28">
                  <div id="enquire" className="border border-hairline bg-white p-7 lg:p-9">
                    <h2 className="text-[clamp(1.5rem,2.4vw,2rem)]">
                      Enquire about {project.name}
                    </h2>
                    <p className="measure-tight mt-3 text-[15px] leading-relaxed text-stone">
                      Price sheet, floor plans and current site photographs, sent the
                      same day.
                    </p>
                    <div className="mt-7">
                      <EnquiryForm
                        projectSlug={project.slug}
                        sourcePage={`/projects/${project.slug}`}
                        size="compact"
                        submitLabel="Request details"
                      />
                    </div>
                    <p className="mt-7 border-t border-hairline pt-5 text-[15px] text-stone">
                      Prefer to talk?{" "}
                      <a href={SITE.phoneHref} className="text-red-primary link-underline pb-0.5">
                        {SITE.phone}
                      </a>
                    </p>
                  </div>

                  <div className="mt-8 border border-hairline">
                    <iframe
                      title={`Map showing ${project.name} in ${project.locality}`}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bboxFor(project.city)}&layer=mapnik`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-[280px] w-full"
                    />
                  </div>
                  <p className="mt-3 text-[14px] text-stone">{project.mapQuery}</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {others.length > 0 && (
          <section className="py-20 lg:py-28">
            <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
              <h2 className="reveal text-[clamp(1.75rem,3.5vw,2.75rem)]">Other projects</h2>
              <ul className="mt-10 border-t border-hairline">
                {others.map((p, i) => (
                  <li
                    key={p.id}
                    className="reveal border-b border-hairline"
                    style={{ ["--d" as string]: `${i * 90}ms` }}
                  >
                    <Link
                      href={`/projects/${p.slug}`}
                      className="row-mark group relative flex flex-wrap items-baseline justify-between gap-4 py-6"
                    >
                      <span className="font-display text-[clamp(1.5rem,3vw,2.5rem)] transition-transform duration-500 group-hover:translate-x-2">
                        {p.name}
                      </span>
                      <span className="label text-stone">
                        {p.locality}, {p.city} · {STATUS_LABEL[p.status]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-12">
                <MarqueeLink href="/projects" label="All projects" tone="outline" />
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
      <RevealObserver />
    </>
  );
}

/** Rough map windows per city, replaced by exact site coordinates on handover. */
function bboxFor(city: string): string {
  const boxes: Record<string, string> = {
    Hyderabad: "78.20%2C17.28%2C78.62%2C17.53",
    Bengaluru: "77.53%2C12.83%2C77.82%2C13.05",
    Vijayawada: "80.52%2C16.44%2C80.75%2C16.58",
    Visakhapatnam: "83.20%2C17.68%2C83.42%2C17.82",
  };
  return boxes[city] ?? "78.20%2C17.28%2C78.62%2C17.53";
}
