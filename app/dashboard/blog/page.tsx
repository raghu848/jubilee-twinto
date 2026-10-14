import Image from "next/image";
import Link from "next/link";
import { listPosts } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { POST_STATUS_LABEL } from "@/lib/types";
import { ConfirmButton } from "@/components/dashboard/confirm-button";
import { deletePostAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Blog" };

export default async function DashboardBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const posts = await listPosts();

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - published;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[clamp(2rem,4vw,3rem)]">Blog</h1>
          <p className="measure mt-3 text-[16px] leading-relaxed text-stone">
            {posts.length === 0
              ? "Nothing written yet."
              : `${published} published · ${drafts} ${drafts === 1 ? "draft" : "drafts"}. Published posts appear on the website immediately.`}
          </p>
        </div>

        <Link
          href="/dashboard/blog/new"
          className="bg-red-primary px-6 py-3 text-[15px] text-white transition-colors hover:bg-red-deep"
        >
          Write a post
        </Link>
      </div>

      {(saved || deleted) && (
        <p role="status" className="mt-8 border-l-2 border-red-primary py-2 pl-5 text-[16px]">
          {saved ? `“${saved}” has been saved.` : `“${deleted}” has been deleted.`}
        </p>
      )}

      {posts.length === 0 ? (
        <div className="mt-12 border-t border-hairline pt-10">
          <p className="measure font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-snug">
            The blog is empty.
          </p>
          <p className="measure mt-4 text-[16px] leading-relaxed text-stone">
            A construction update with three photographs and four sentences is
            worth more than a long article nobody finishes. Write the first one.
          </p>
        </div>
      ) : (
        <ul className="mt-10 border-t border-hairline">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-hairline py-6">
              <div className="flex flex-wrap items-start gap-6">
                <div className="relative h-24 w-32 shrink-0 overflow-hidden border border-hairline bg-white">
                  {post.coverImage ? (
                    <Image src={post.coverImage} alt="" fill sizes="128px" className="object-cover" />
                  ) : (
                    <span className="slot-hatch flex h-full w-full items-center justify-center text-[12px] text-stone">
                      No cover
                    </span>
                  )}
                </div>

                <div className="min-w-[240px] flex-1">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <Link
                      href={`/dashboard/blog/${post.id}`}
                      className="max-w-[46ch] font-display text-[24px] leading-snug transition-colors hover:text-red-primary"
                    >
                      {post.title}
                    </Link>
                    <span
                      className={`text-[13px] ${
                        post.status === "published" ? "text-stone" : "text-red-primary"
                      }`}
                    >
                      {POST_STATUS_LABEL[post.status]}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[15px] text-stone">
                    {post.category} · {post.author} · {formatDate(post.publishedAt)}
                  </p>
                  <p className="mt-1 text-[14px] text-stone">
                    {post.blocks.length} blocks ·{" "}
                    {post.blocks.filter((b) => b.kind === "image").length} images · /blog/
                    {post.slug}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <Link
                    href={`/dashboard/blog/${post.id}`}
                    className="border border-hairline px-4 py-2 text-[14px] transition-colors hover:border-red-primary hover:text-red-primary"
                  >
                    Edit
                  </Link>
                  {post.status === "published" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="border border-hairline px-4 py-2 text-[14px] transition-colors hover:border-red-primary hover:text-red-primary"
                    >
                      View ↗
                    </Link>
                  )}
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <ConfirmButton
                      confirmLabel="Click again to delete"
                      className="border border-hairline px-4 py-2 text-[14px] text-stone transition-colors hover:border-red-primary hover:text-red-primary"
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
