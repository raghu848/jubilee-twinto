import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1560px] px-5 pb-28 pt-40 lg:px-8 lg:py-48">
        <h1 className="text-[clamp(2.75rem,8vw,6rem)]">
          That page has moved
          <br />
          or never existed.
        </h1>
        <p className="measure mt-6 text-[17px] leading-relaxed text-stone">
          If you were looking for a particular project, it may have been renamed
          after handover. Everything currently on sale is listed below.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="bg-red-primary px-7 py-4 text-[16px] text-white transition-colors hover:bg-red-deep"
          >
            See all projects
          </Link>
          <Link
            href="/contact"
            className="border border-hairline px-7 py-4 text-[16px] transition-colors hover:border-red-primary hover:text-red-primary"
          >
            Talk to us
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
