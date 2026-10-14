import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ImageSlot } from "@/components/image-slot";
import { MarqueeLink } from "@/components/marquee-link";
import { RevealObserver } from "@/components/reveal-observer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jubilee Sales has been developing residential and commercial property across South India since 2009.",
};

/* A genuine chronology, so dated entries are the honest way to show it. */
const MILESTONES = [
  {
    year: "2009",
    title: "First layout at Shankarpally",
    body: "Twenty-eight plots on eleven acres, funded by three families who had worked together in construction for a decade.",
  },
  {
    year: "2013",
    title: "First residential building",
    body: "A 42-home building in Kondapur that moved us from selling land to delivering finished homes.",
  },
  {
    year: "2017",
    title: "Bengaluru office opens",
    body: "We stopped taking on sites we could not reach on a weekday and put a permanent team on the ground instead.",
  },
  {
    year: "2021",
    title: "Handover commitment written into the agreement",
    body: "A dated handover clause with a penalty payable to the buyer became standard on every project we sell.",
  },
  {
    year: "2025",
    title: "Jubilee Anchorage delivered early",
    body: "Ninety-six homes in Visakhapatnam handed over four months ahead of the committed date.",
  },
  {
    year: "2026",
    title: "Jubilee Exchange, our first commercial building",
    body: "Two and a half lakh square feet at Gachibowli, opening for pre-leasing in March.",
  },
];

/*
  Leadership names are left as bracketed placeholders on purpose — real people
  should not be invented for a real company. Jubilee Sales fills these in.
*/
const LEADERSHIP = [
  { role: "Managing Director", note: "Two or three lines on background and what they are responsible for." },
  { role: "Director, Projects", note: "Two or three lines on background and what they are responsible for." },
  { role: "Head of Sales", note: "Two or three lines on background and what they are responsible for." },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="pt-24 lg:pt-28">
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-[1560px] px-5 py-16 lg:px-8 lg:py-24">
            <h1 className="text-[clamp(2.75rem,8vw,7rem)]">
              Seventeen years,
              <br />
              one way of{" "}
              <span className="script text-red-primary [font-size:1.15em] [line-height:0.8]">
                working
              </span>
            </h1>

            <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
              <div>
                <p className="measure text-[17px] leading-relaxed text-ink/85 lg:text-[18px]">
                  Jubilee Sales was started in 2009 by three families who had spent
                  the previous decade building for other developers. We began with a
                  single plotted layout at Shankarpally because it was the only thing
                  we could afford to do properly, and we have kept the same rule
                  since: take on what we can finish, and finish it when we said we
                  would.
                </p>
                <p className="measure mt-6 text-[16px] leading-relaxed text-stone">
                  Today that means {SITE.stats.projectsDelivered} projects across{" "}
                  {SITE.cities.length} cities and {SITE.stats.sqftDelivered} square
                  feet delivered. It also means turning down roughly half the land we
                  are offered, usually on title, and occasionally because we simply
                  do not have the team to spare.
                </p>
              </div>

              <div className="reveal-wipe">
                <ImageSlot
                  alt="The founding team on site, or the first Shankarpally layout as it stands today"
                  aspect="aspect-[4/5]"
                  note="1200 × 1500 · portrait"
                  sizes="(max-width: 1024px) 92vw, 44vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ milestones ---- */}
        <section className="bg-white py-20 lg:py-32">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <h2 className="reveal text-[clamp(2rem,4.5vw,3.5rem)]">How we got here</h2>

            <ol className="mt-14 border-t border-hairline">
              {MILESTONES.map((m, i) => (
                <li
                  key={m.year}
                  className="reveal grid gap-3 border-b border-hairline py-8 md:grid-cols-[140px_1fr_1.4fr] md:gap-12"
                  style={{ ["--d" as string]: `${i * 80}ms` }}
                >
                  <span className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-red-primary">
                    {m.year}
                  </span>
                  <h3 className="text-[clamp(1.2rem,1.8vw,1.5rem)]">{m.title}</h3>
                  <p className="text-[16px] leading-relaxed text-stone">{m.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------- editorial band ---- */}
        <section className="relative isolate flex min-h-[60svh] items-end overflow-hidden bg-ink">
          <ImageSlot
            alt="Construction in progress — site engineers at work, wide shot"
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
            <h2 className="reveal max-w-[20ch] text-[clamp(1.75rem,4vw,3.25rem)] text-white">
              Our engineers are on our payroll. Contractors change between projects;
              the people checking their work do not.
            </h2>
          </div>
        </section>

        {/* --------------------------------------------- how we work ------ */}
        <section className="py-20 lg:py-32">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <h2 className="reveal text-[clamp(2rem,4.5vw,3.5rem)] lg:sticky lg:top-32 lg:self-start">
                How we work
              </h2>

              <div>
                {[
                  {
                    title: "We buy land outright before we sell it",
                    body: "Every project on this site sits on land we own, not land we hold under a development agreement or a memorandum of understanding. It slows us down and it removes an entire category of risk from your purchase.",
                  },
                  {
                    title: "One price, published",
                    body: "The rate you are quoted is the rate everyone is quoted that week, and the breakdown of registration, GST and statutory charges is written down before you book.",
                  },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className="reveal border-t border-hairline py-9 last:border-b"
                    style={{ ["--d" as string]: `${i * 110}ms` }}
                  >
                    <h3 className="text-[clamp(1.4rem,2.4vw,2rem)]">{item.title}</h3>
                    <p className="measure mt-4 text-[16px] leading-relaxed text-stone">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ leadership ---- */}
        <section className="border-t border-hairline bg-white py-20 lg:py-32">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <h2 className="reveal text-[clamp(2rem,4.5vw,3.5rem)]">Leadership</h2>
            <p className="reveal measure mt-5 text-[15px] leading-relaxed text-stone">
              Names, photographs and biographies to be supplied by Jubilee Sales —
              left blank here rather than filled with invented people.
            </p>

            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {LEADERSHIP.map((person, i) => (
                <div key={person.role} className="reveal" style={{ ["--d" as string]: `${i * 110}ms` }}>
                  <ImageSlot
                    alt={`Portrait — ${person.role}`}
                    aspect="aspect-[4/5]"
                    note="1000 × 1250 · portrait"
                    sizes="(max-width: 768px) 92vw, 30vw"
                  />
                  <h3 className="mt-6 text-[clamp(1.3rem,2vw,1.6rem)] text-stone/55">[ Name ]</h3>
                  <p className="label mt-2 text-stone">{person.role}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-stone/60">{person.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-red-primary py-20 text-white lg:py-28">
          <div className="mx-auto flex max-w-[1560px] flex-wrap items-end justify-between gap-10 px-5 lg:px-8">
            <div>
              <h2 className="reveal text-[clamp(2rem,4.5vw,3.5rem)] text-white">
                See what we are building now.
              </h2>
              <p className="reveal measure mt-5 text-[16px] leading-relaxed text-white/80">
                Six projects are open for visits across four cities.
              </p>
            </div>
            <MarqueeLink href="/projects" label="Explore projects" tone="light" />
          </div>
        </section>
      </main>

      <SiteFooter />
      <RevealObserver />
    </>
  );
}
