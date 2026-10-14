import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ImageSlot } from "@/components/image-slot";
import { MarqueeLink } from "@/components/marquee-link";
import { RevealObserver } from "@/components/reveal-observer";
import { listPublishedPosts } from "@/lib/store";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Construction updates, handover notes and buying guides from the Jubilee Sales team.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const all = await listPublishedPosts();
  const categories = [...new Set(all.map((p) => p.category).filter(Boolean))].sort();

  const active = category ?? "all";
  const posts = active === "all" ? all : all.filter((p) => p.category === active);

  const [lead, ...rest] = posts;

  return (
    <>
      <SiteHeader />

      <main id="main" className="pt-24 lg:pt-28">
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-[1560px] px-5 py-16 lg:px-8 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-20">
              <h1 className="text-[clamp(2.75rem,8vw,7rem)]">
                From the{" "}
                <span className="script text-red-primary [font-size:1.15em] [line-height:0.8]">
                  site
                </span>
              </h1>
              <p className="measure text-[16px] leading-relaxed text-stone lg:text-[17px]">
                What is happening on our projects, written by the people building
                them. Construction updates, handover notes, and the things we think
                a buyer should ask any developer before signing.
              </p>
            </div>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="sticky top-[73px] z-30 border-b border-hairline bg-paper/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1560px] flex-wrap items-baseline gap-x-6 gap-y-2 px-5 py-4 lg:px-8">
              <span className="label w-16 shrink-0 text-stone">Filter</span>
              {["all", ...categories].map((c) => (
                <Link
                  key={c}
                  href={c === "all" ? "/blog" : `/blog?category=${encodeURIComponent(c)}`}
                  aria-current={active === c ? "true" : undefined}
                  className={`border-b pb-0.5 text-[15px] transition-colors duration-300 ${
                    active === c
                      ? "border-red-primary text-red-primary"
                      : "border-transparent text-ink hover:border-hairline hover:text-stone"
                  }`}
                >
                  {c === "all" ? "All" : c}
                </Link>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 ? (
          <section className="py-24 lg:py-32">
            <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
              <p className="measure font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-snug">
                Nothing published under that heading yet.
              </p>
              <div className="mt-8">
                <MarqueeLink href="/blog" label="All posts" tone="outline" />
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Lead post, given the width it deserves */}
            <section className="py-16 lg:py-20">
              <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
                <Link href={`/blog/${lead.slug}`} className="group block">
                  <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <div className="reveal-wipe overflow-hidden">
                      <div className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
                        <ImageSlot
                          src={lead.coverImage || undefined}
                          alt={lead.coverAlt || lead.title}
                          aspect="aspect-[16/10]"
                          priority
                          sizes="(max-width: 1024px) 92vw, 55vw"
                          note="1800 × 1125"
                        />
                      </div>
                    </div>

                    <div className="reveal self-center">
                      <p className="label text-stone">
                        {lead.category} · {formatDate(lead.publishedAt)}
                      </p>
                      <h2 className="mt-4 text-[clamp(1.9rem,4vw,3.25rem)] transition-colors duration-300 group-hover:text-red-primary">
                        {lead.title}
                      </h2>
                      <p className="measure mt-5 text-[16px] leading-relaxed text-stone lg:text-[17px]">
                        {lead.excerpt}
                      </p>
                      <p className="label mt-7 inline-flex items-center gap-3 border-b border-ink/25 pb-1 transition-colors group-hover:border-red-primary group-hover:text-red-primary">
                        Read the post
                        <span aria-hidden="true">→</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {rest.length > 0 && (
              <section className="border-t border-hairline py-16 lg:py-24">
                <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
                  <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post, i) => (
                      <article
                        key={post.id}
                        className="reveal"
                        style={{ ["--d" as string]: `${(i % 3) * 100}ms` }}
                      >
                        <Link href={`/blog/${post.slug}`} className="group block">
                          <div className="overflow-hidden">
                            <div className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                              <ImageSlot
                                src={post.coverImage || undefined}
                                alt={post.coverAlt || post.title}
                                aspect="aspect-[4/3]"
                                sizes="(max-width: 768px) 92vw, 30vw"
                                note="1600 × 1200"
                              />
                            </div>
                          </div>
                          <p className="label mt-5 text-stone">
                            {post.category} · {formatDate(post.publishedAt)}
                          </p>
                          <h3 className="mt-3 text-[clamp(1.35rem,2.2vw,1.75rem)] transition-colors duration-300 group-hover:text-red-primary">
                            {post.title}
                          </h3>
                          <p className="measure-tight mt-3 text-[15px] leading-relaxed text-ink/70">
                            {post.excerpt}
                          </p>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <section className="bg-ink py-20 text-white lg:py-28">
          <div className="mx-auto flex max-w-[1560px] flex-wrap items-end justify-between gap-10 px-5 lg:px-8">
            <h2 className="reveal max-w-[18ch] text-[clamp(2rem,4.5vw,3.5rem)] text-white">
              Come and see one of them for yourself.
            </h2>
            <MarqueeLink href="/contact" label="Arrange a site visit" tone="light" />
          </div>
        </section>
      </main>

      <SiteFooter />
      <RevealObserver />
    </>
  );
}
