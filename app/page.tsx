import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/project-card";
import { EnquiryForm } from "@/components/enquiry-form";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { ImageSlot } from "@/components/image-slot";
import { MarqueeLink } from "@/components/marquee-link";
import { RevealObserver } from "@/components/reveal-observer";
import { listProjects } from "@/lib/store";
import { SITE } from "@/lib/site";
import { TESTIMONIALS } from "@/lib/testimonials";
import type { ProjectType } from "@/lib/types";

// Widths chosen so the varied aspect ratios land at roughly similar heights
// without forcing every card into the same box.
const STRIP_WIDTH: Record<ProjectType, string> = {
  apartments: "w-[280px] sm:w-[330px]",
  commercial: "w-[280px] sm:w-[330px]",
  villas: "w-[380px] sm:w-[450px]",
  plots: "w-[420px] sm:w-[520px]",
};

export default async function HomePage() {
  const projects = await listProjects();
  const flagship = projects.find((p) => p.flagship) ?? projects[0];
  const featured = projects.slice(0, 4);
  const cityCounts = SITE.cities.map((city) => ({
    city,
    count: projects.filter((p) => p.city === city).length,
  }));

  return (
    <>
      <SiteHeader overlay />

      <main id="main">
        <Hero projectCount={projects.length} />

        {/* ------------------------------------------------ statement ---- */}
        <section className="border-b border-hairline py-24 lg:py-36">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
              <h2 className="reveal text-[clamp(2rem,5vw,4.25rem)]">
                Seventeen years of handing over
                <br />
                on the date we{" "}
                <span className="script text-red-primary [font-size:1.2em] [line-height:0.8]">
                  promised
                </span>
                .
              </h2>

              <div className="reveal self-end" style={{ ["--d" as string]: "140ms" }}>
                <p className="measure text-[16px] leading-relaxed text-stone lg:text-[17px]">
                  Jubilee Sales was started in 2009 by three families who had spent
                  the previous decade building for other developers. We began with a
                  single plotted layout at Shankarpally because it was the only thing
                  we could afford to do properly, and we have kept the same rule
                  since: take on what we can finish, and finish it when we said we
                  would.
                </p>
                <Link
                  href="/about"
                  className="label mt-7 inline-flex items-center gap-3 border-b border-ink/25 pb-1 transition-colors hover:border-red-primary hover:text-red-primary"
                >
                  About the company
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <dl className="mt-20 grid gap-y-10 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [projects.length, "Projects on sale"],
                [SITE.cities.length, "Cities"],
                [SITE.stats.sqftDelivered, "Sq ft delivered"],
                [SITE.stats.yearFounded, "Building since"],
              ].map(([value, label], i) => (
                <div key={String(label)} className="reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
                  <dt className="label text-stone">{label}</dt>
                  <dd className="mt-3 font-display text-[clamp(2.5rem,4.5vw,3.75rem)] leading-none">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------------------- featured projects ---- */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <div className="reveal flex flex-wrap items-end justify-between gap-6">
              <h2 className="text-[clamp(2rem,4.5vw,3.5rem)]">Currently selling</h2>
              <Link
                href="/projects"
                className="label border-b border-ink/25 pb-1 transition-colors hover:border-red-primary hover:text-red-primary"
              >
                All {projects.length} projects
              </Link>
            </div>
          </div>

          <div className="mt-14 overflow-x-auto pb-5">
            <div className="mx-auto flex w-max gap-8 px-5 lg:gap-12 lg:px-8">
              {featured.map((project, i) => (
                <div
                  key={project.id}
                  className={`reveal shrink-0 ${STRIP_WIDTH[project.type]}`}
                  style={{ ["--d" as string]: `${i * 110}ms` }}
                >
                  <ProjectCard project={project} priority={i < 2} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- why us ---- */}
        <section className="border-y border-hairline bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <h2 className="reveal text-[clamp(2rem,4.5vw,3.5rem)]">
                  Three things we will not
                  <br />
                  compromise on.
                </h2>
                <p className="reveal measure-tight mt-6 text-[16px] leading-relaxed text-stone">
                  Every one of these costs us money or speed. They are the reasons
                  buyers come back to us for a second home.
                </p>
              </div>

              <div>
                {[
                  {
                    title: "We hand over on the committed date",
                    body: "Jubilee Anchorage was delivered four months early. Every project since carries a dated handover commitment in the sale agreement, with a penalty clause that runs in your favour, not ours.",
                  },
                  {
                    title: "Title work is finished before you pay",
                    body: "We give your advocate the full title chain, approvals and encumbrance certificate before you pay anything beyond the booking amount. If your lawyer finds a problem, the booking is refunded in full.",
                  },
                  {
                    title: "Common areas are built alongside the homes",
                    body: "Clubhouses, parks and roads are scheduled with the towers rather than deferred until the last flat is sold. You move into a finished development, not a construction site with a completed flat in it.",
                  },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className="reveal border-t border-hairline py-9 last:border-b"
                    style={{ ["--d" as string]: `${i * 120}ms` }}
                  >
                    <h3 className="text-[clamp(1.4rem,2.4vw,2rem)]">{item.title}</h3>
                    <p className="measure mt-4 text-[16px] leading-relaxed text-stone">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------ flagship section ---- */}
        {flagship && (
          <section className="py-24 lg:py-32">
            <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
              <div className="reveal flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-6">
                <div>
                  <p className="label text-stone">
                    {flagship.locality}, {flagship.city}
                  </p>
                  <h2 className="mt-3 text-[clamp(2.25rem,6vw,5rem)]">{flagship.name}</h2>
                </div>
                <p className="measure-tight text-[16px] leading-relaxed text-stone">
                  {flagship.tagline}
                </p>
              </div>

              <div className="mt-12 grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
                <div className="reveal-wipe">
                  <Gallery items={flagship.gallery} aspect="aspect-[4/3]" />
                </div>

                <div>
                  <dl className="reveal grid grid-cols-2 gap-x-8 gap-y-6">
                    {flagship.specs.slice(0, 4).map((spec) => (
                      <div key={spec.label}>
                        <dt className="label text-stone">{spec.label}</dt>
                        <dd className="mt-2 font-display text-[clamp(1.3rem,2vw,1.75rem)]">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="reveal mt-10 border-t border-hairline pt-9">
                    <h3 className="text-[clamp(1.4rem,2.2vw,1.85rem)]">Register interest</h3>
                    <p className="measure-tight mt-3 text-[15px] leading-relaxed text-stone">
                      Leave a number and we will send the floor plates, the price
                      sheet and the current construction photographs.
                    </p>
                    <div className="mt-7">
                      <EnquiryForm
                        projectSlug={flagship.slug}
                        sourcePage="/"
                        size="compact"
                        submitLabel="Send me the details"
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <MarqueeLink href={`/projects/${flagship.slug}`} label="Full project details" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------- editorial band ----- */}
        <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-ink">
          <ImageSlot
            alt="Full-bleed lifestyle image — residents using the landscape deck, late light"
            tone="dark"
            note="2400 × 1200 · landscape"
            sizes="100vw"
            caption="corner"
            className="absolute inset-0 h-full w-full"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent"
          />

          <div className="relative mx-auto w-full max-w-[1560px] px-5 py-16 lg:px-8 lg:py-24">
            <h2 className="reveal max-w-[18ch] text-[clamp(2rem,5.5vw,4.5rem)] text-white">
              A home you move into
              <br />
              <span className="script text-white [font-size:1.15em] [line-height:0.85]">finished</span>
              , not promised.
            </h2>
            <p className="reveal measure mt-8 text-[16px] leading-relaxed text-white/70">
              Clubhouse, podium, landscape and roads are complete on the day the
              first family moves in. It is the single thing buyers tell us made the
              difference, and the single thing most developers defer.
            </p>
          </div>
        </section>


        <Testimonials />

        {/* ------------------------------------------------- locations ---- */}
        <section className="border-b border-hairline bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div>
                <h2 className="reveal text-[clamp(2rem,4.5vw,3.5rem)]">Where we build</h2>
                <p className="reveal measure-tight mt-6 text-[16px] leading-relaxed text-stone">
                  Four cities, chosen because we have people on the ground in each
                  one. We do not develop in a market we cannot visit on a weekday.
                </p>

                <ul className="mt-12 border-t border-hairline">
                  {cityCounts.map(({ city, count }, i) => (
                    <li
                      key={city}
                      className="reveal relative flex items-baseline justify-between border-b border-hairline py-5"
                      style={{ ["--d" as string]: `${i * 80}ms` }}
                    >
                      <span className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)]">{city}</span>
                      <span className="label text-stone">
                        {count === 0 ? "Coming soon" : `${count} project${count > 1 ? "s" : ""}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal-wipe">
                <div className="border border-hairline">
                  <iframe
                    title="Map of Jubilee Sales project locations across South India"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=76.8%2C15.6%2C84.0%2C19.2&layer=mapnik"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[420px] w-full lg:h-[560px]"
                  />
                </div>
                <p className="mt-4 text-[14px] text-stone">
                  Head office: {SITE.office.line1}, {SITE.office.line2}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- final CTA ---- */}
        <section className="bg-red-primary py-24 text-white lg:py-32">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <h2 className="reveal text-[clamp(2.25rem,6vw,4.5rem)] text-white">
                  Come and{" "}
                  <span className="script [font-size:1.15em] [line-height:0.85]">see</span> one.
                </h2>
                <p className="reveal measure mt-7 text-[16px] leading-relaxed text-white/80 lg:text-[17px]">
                  Site visits run seven days a week. Tell us which project you are
                  interested in and we will arrange a car from the nearest metro
                  station or airport.
                </p>
                <p className="reveal mt-9 font-display text-[clamp(1.6rem,3vw,2.4rem)]">
                  <a href={SITE.phoneHref} className="link-underline pb-1">
                    {SITE.phone}
                  </a>
                </p>
              </div>

              <div className="reveal" style={{ ["--d" as string]: "120ms" }}>
                <EnquiryForm sourcePage="/" tone="dark" submitLabel="Arrange a site visit" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <RevealObserver />
    </>
  );
}

/*
  Real quotes only. Until Jubilee Sales supplies them, this section shows the
  structure in development so the layout can be reviewed, and hides itself in
  production so the live site never carries empty or invented praise.
*/
function Testimonials() {
  if (TESTIMONIALS.length === 0 && process.env.NODE_ENV === "production") return null;

  return (
    <section className="border-b border-hairline py-24 lg:py-32">
      <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
        <h2 className="reveal text-[clamp(2rem,4.5vw,3.5rem)]">
          From the people who live here
        </h2>

        {TESTIMONIALS.length === 0 ? (
          <>
            <p className="reveal measure mt-6 text-[16px] leading-relaxed text-stone">
              Placeholder structure. Add real, attributed quotes in{" "}
              <code className="text-ink">lib/testimonials.ts</code> and this section
              publishes itself. With none added, it is hidden from the live site.
            </p>
            <div className="mt-14 grid gap-12 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <figure
                  key={i}
                  className="reveal border-t border-hairline pt-7"
                  style={{ ["--d" as string]: `${i * 110}ms` }}
                >
                  <blockquote className="font-display text-[clamp(1.3rem,2vw,1.6rem)] leading-snug text-stone/45">
                    Owner quote goes here — two or three sentences, in their words.
                  </blockquote>
                  <figcaption className="label mt-6 text-stone/45">
                    Name · Project · Year of possession
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                className="reveal border-t border-hairline pt-7"
                style={{ ["--d" as string]: `${i * 110}ms` }}
              >
                <blockquote className="font-display text-[clamp(1.3rem,2vw,1.6rem)] leading-snug">
                  {t.quote}
                </blockquote>
                <figcaption className="label mt-6 text-stone">
                  {t.name} · {t.project}
                  {t.year ? ` · ${t.year}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
