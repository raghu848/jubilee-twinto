import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { RevealObserver } from "@/components/reveal-observer";
import { SITE } from "@/lib/site";
import { listProjects } from "@/lib/store";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to the Jubilee Sales team. ${SITE.office.line1}, ${SITE.office.line2}.`,
};

export default async function ContactPage() {
  const projects = await listProjects();

  return (
    <>
      <SiteHeader />

      <main id="main" className="pt-24 lg:pt-28">
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-[1560px] px-5 py-16 lg:px-8 lg:py-24">
            <h1 className="text-[clamp(2.75rem,8vw,7rem)]">Talk to us</h1>
            <p className="measure mt-6 text-[18px] leading-relaxed text-stone">
              Call the sales desk, send an enquiry, or come to the office. Site
              visits run seven days a week and we will arrange transport from the
              nearest metro station or airport.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <div>
                <div className="border-t border-hairline pt-7">
                  <h2 className="label text-stone">Sales desk</h2>
                  <p className="mt-3 font-display text-[30px]">
                    <a href={SITE.phoneHref} className="transition-colors hover:text-red-primary">
                      {SITE.phone}
                    </a>
                  </p>
                  <p className="mt-2 text-[16px]">
                    <a
                      href={SITE.whatsappHref}
                      className="link-underline pb-0.5 text-red-primary"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      WhatsApp {SITE.whatsapp}
                    </a>
                  </p>
                  <p className="mt-3 text-[15px] text-stone">{SITE.hours}</p>
                </div>

                <div className="mt-10 border-t border-hairline pt-7">
                  <h2 className="label text-stone">Email</h2>
                  <p className="mt-3 text-[18px]">
                    <a
                      href={`mailto:${SITE.email}`}
                      className="link-underline pb-0.5"
                    >
                      {SITE.email}
                    </a>
                  </p>
                </div>

                <div className="mt-10 border-t border-hairline pt-7">
                  <h2 className="label text-stone">Head office</h2>
                  <address className="mt-3 space-y-1 text-[18px] not-italic leading-relaxed">
                    <p>{SITE.office.line1}</p>
                    <p>{SITE.office.line2}</p>
                    <p className="text-stone">{SITE.office.state}</p>
                  </address>
                </div>

                <div className="mt-10 border-t border-hairline pt-7">
                  <h2 className="label text-stone">Site offices</h2>
                  <ul className="mt-3 space-y-2 text-[16px]">
                    {projects.map((p) => (
                      <li key={p.id}>
                        {p.name} —{" "}
                        <span className="text-stone">
                          {p.locality}, {p.city}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="border border-hairline bg-white p-7 lg:p-10">
                  <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)]">Send an enquiry</h2>
                  <p className="measure mt-3 text-[16px] leading-relaxed text-stone">
                    Tell us what you are looking for and someone from the sales team
                    will call you within one working day.
                  </p>
                  <div className="mt-9">
                    <EnquiryForm sourcePage="/contact" submitLabel="Send enquiry" />
                  </div>
                </div>

                <div className="mt-10 border border-hairline">
                  <iframe
                    title="Map showing the Jubilee Sales head office in Jubilee Hills, Hyderabad"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=78.38%2C17.40%2C78.44%2C17.44&layer=mapnik"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[340px] w-full"
                  />
                </div>
                <p className="mt-3 text-[14px] text-stone">
                  Parking is available in the building basement, entry from the rear
                  lane.
                </p>
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
