import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ImageSlot } from "@/components/image-slot";
import { PostBody } from "@/components/post-body";
import { MarqueeLink } from "@/components/marquee-link";
import { RevealObserver } from "@/components/reveal-observer";
import { getPostBySlug, getProjectBySlug, listPublishedPosts } from "@/lib/store";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Drafts are invisible to the public even if somebody has the URL.
  if (!post || post.status !== "published") notFound();

  const project = post.projectSlug ? await getProjectBySlug(post.projectSlug) : null;
  const others = (await listPublishedPosts()).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main id="main" className="pt-24 lg:pt-28">
        <article>
          <header className="border-b border-hairline">
            <div className="mx-auto max-w-[1560px] px-5 py-14 lg:px-8 lg:py-20">
              <Link href="/blog" className="link-underline pb-0.5 text-[15px] text-stone">
                ← All posts
              </Link>

              <p className="label mt-8 text-red-primary">{post.category}</p>

              <h1 className="mt-4 max-w-[20ch] text-[clamp(2.25rem,6.5vw,5.5rem)]">
                {post.title}
              </h1>

              <p className="measure mt-7 text-[17px] leading-relaxed text-stone lg:text-[19px]">
                {post.excerpt}
              </p>

              <p className="label mt-9 text-stone">
                {post.author} · {formatDate(post.publishedAt)}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-[1560px] px-5 py-12 lg:px-8 lg:py-16">
            <div className="reveal-wipe">
              <ImageSlot
                src={post.coverImage || undefined}
                alt={post.coverAlt || post.title}
                aspect="aspect-[16/9]"
                priority
                sizes="100vw"
                note="2400 × 1350"
              />
            </div>
            {post.coverAlt && (
              <p className="mt-3 text-[14px] text-stone">{post.coverAlt}</p>
            )}
          </div>

          <div className="mx-auto max-w-[1560px] px-5 pb-20 lg:px-8 lg:pb-28">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20">
              {/* Running text stays near 65 characters wide */}
              <div className="max-w-[68ch]">
                <PostBody blocks={post.blocks} />
              </div>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                {project && (
                  <div className="border border-hairline bg-white p-6">
                    <p className="label text-stone">This post is about</p>
                    <h2 className="mt-3 text-[clamp(1.3rem,2vw,1.6rem)]">{project.name}</h2>
                    <p className="mt-2 text-[15px] text-stone">
                      {project.locality}, {project.city}
                    </p>
                    <p className="mt-5">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="label border-b border-ink/25 pb-1 transition-colors hover:border-red-primary hover:text-red-primary"
                      >
                        See the project
                      </Link>
                    </p>
                  </div>
                )}

                <div className={`border border-hairline bg-white p-6 ${project ? "mt-6" : ""}`}>
                  <p className="label text-stone">Filed under</p>
                  <p className="mt-3 text-[17px]">{post.category}</p>
                  <p className="mt-5">
                    <Link
                      href={`/blog?category=${encodeURIComponent(post.category)}`}
                      className="label border-b border-ink/25 pb-1 transition-colors hover:border-red-primary hover:text-red-primary"
                    >
                      More like this
                    </Link>
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </article>

        {others.length > 0 && (
          <section className="border-t border-hairline py-16 lg:py-24">
            <div className="mx-auto max-w-[1560px] px-5 lg:px-8">
              <h2 className="reveal text-[clamp(1.75rem,3.5vw,2.75rem)]">Read next</h2>
              <ul className="mt-10 border-t border-hairline">
                {others.map((p, i) => (
                  <li
                    key={p.id}
                    className="reveal border-b border-hairline"
                    style={{ ["--d" as string]: `${i * 90}ms` }}
                  >
                    <Link
                      href={`/blog/${p.slug}`}
                      className="row-mark group relative flex flex-wrap items-baseline justify-between gap-4 py-6"
                    >
                      <span className="max-w-[30ch] font-display text-[clamp(1.3rem,2.6vw,2rem)] transition-transform duration-500 group-hover:translate-x-2">
                        {p.title}
                      </span>
                      <span className="label text-stone">
                        {p.category} · {formatDate(p.publishedAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-12">
                <MarqueeLink href="/blog" label="All posts" tone="outline" />
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
