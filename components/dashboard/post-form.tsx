"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { savePostAction } from "@/app/dashboard/blog/actions";
import { emptyPostFormState } from "@/lib/post-form";
import { BlockEditor } from "@/components/dashboard/block-editor";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { POST_CATEGORIES, POST_STATUSES, POST_STATUS_LABEL, type Post } from "@/lib/types";

const field =
  "mt-1.5 w-full border border-hairline bg-white px-3.5 py-2.5 text-[16px] outline-none transition-colors focus:border-red-primary";
const label = "text-[13px] text-stone";

export function PostForm({
  post,
  projects,
}: {
  post?: Post;
  projects: { slug: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(savePostAction, emptyPostFormState);
  const [cover, setCover] = useState(post?.coverImage ?? "");

  const err = (key: string) =>
    state.fieldErrors[key] ? (
      <p className="mt-1.5 text-[13px] text-red-primary">{state.fieldErrors[key]}</p>
    ) : null;

  // The date input wants YYYY-MM-DD in Indian time, not the stored UTC instant.
  const dateValue = (post?.publishedAt ? new Date(post.publishedAt) : new Date())
    .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  return (
    <form action={formAction} className="mt-10 space-y-14">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="coverImage" value={cover} />

      <section>
        <h2 className="text-[26px]">The post</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className={label}>Title</label>
            <input id="title" name="title" defaultValue={post?.title} required className={field} />
            {err("title")}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="excerpt" className={label}>
              Standfirst <span className="text-stone/70">— the sentence or two shown on the blog index</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={post?.excerpt}
              required
              className={`${field} resize-y leading-relaxed`}
            />
            {err("excerpt")}
          </div>

          <div>
            <label htmlFor="category" className={label}>Category</label>
            <input
              id="category"
              name="category"
              list="post-categories"
              defaultValue={post?.category ?? POST_CATEGORIES[0]}
              required
              className={field}
            />
            <datalist id="post-categories">
              {POST_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <p className="mt-1.5 text-[13px] text-stone">
              Pick one of the suggestions or type your own — readers can filter by it.
            </p>
            {err("category")}
          </div>

          <div>
            <label htmlFor="author" className={label}>Written by</label>
            <input
              id="author"
              name="author"
              defaultValue={post?.author ?? "Jubilee Sales"}
              required
              placeholder="Site team, Jubilee Vantage"
              className={field}
            />
            {err("author")}
          </div>

          <div>
            <label htmlFor="publishedAt" className={label}>Date</label>
            <input
              id="publishedAt"
              name="publishedAt"
              type="date"
              defaultValue={dateValue}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="projectSlug" className={label}>
              About a project <span className="text-stone/70">(optional)</span>
            </label>
            <select
              id="projectSlug"
              name="projectSlug"
              defaultValue={post?.projectSlug ?? ""}
              className={field}
            >
              <option value="">Not about one project</option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[13px] text-stone">
              Adds a link to that project alongside the post.
            </p>
          </div>

          <div>
            <label htmlFor="slug" className={label}>
              Web address <span className="text-stone/70">(leave blank to build it from the title)</span>
            </label>
            <input id="slug" name="slug" defaultValue={post?.slug} className={field} />
            <p className="mt-1.5 text-[13px] text-stone">
              /blog/<span className="text-ink">{post?.slug ?? "…"}</span>
            </p>
          </div>

          <div>
            <label htmlFor="status" className={label}>Status</label>
            <select
              id="status"
              name="status"
              defaultValue={post?.status ?? "draft"}
              className={field}
            >
              {POST_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {POST_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[13px] text-stone">
              A draft is invisible to the public, even to anyone holding the link.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[26px]">Cover image</h2>
        <p className="measure mt-2 text-[15px] leading-relaxed text-stone">
          Used at the top of the post and on the blog index. Landscape, around
          2400 × 1350. Leave it empty and the post shows a frame naming the shot
          it needs.
        </p>
        <div className="mt-6 max-w-[640px] space-y-4">
          <ImageUpload url={cover} onChange={setCover} label="Cover" />
          <label className="block">
            <span className={label}>
              Caption — also read aloud to anyone using a screen reader
            </span>
            <input
              name="coverAlt"
              defaultValue={post?.coverAlt}
              placeholder="Tower A from the site entrance, twelfth slab poured"
              className={field}
            />
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-[26px]">Body</h2>
        <p className="measure mt-2 text-[15px] leading-relaxed text-stone">
          Add paragraphs, subheadings, pull quotes, bulleted lists and images in
          any order. Images sit in the flow of the writing, so put one wherever it
          belongs rather than at the top.
        </p>
        <div className="mt-6">
          <BlockEditor name="blocks" initial={post?.blocks ?? []} />
        </div>
      </section>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-[15px] text-red-primary">
          {state.message}
        </p>
      )}

      <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-5 border-t border-hairline bg-paper/95 px-6 py-5 backdrop-blur-sm lg:-mx-10 lg:px-10">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2.5 bg-red-primary px-7 py-3.5 text-[15px] text-white transition-colors hover:bg-red-deep disabled:cursor-progress disabled:bg-red-primary/70"
        >
          {isPending && (
            <span
              className="spin block h-3.5 w-3.5 rounded-full border-[1.5px] border-current border-t-transparent"
              aria-hidden="true"
            />
          )}
          {isPending ? "Saving" : post ? "Save changes" : "Save post"}
        </button>

        <Link href="/dashboard/blog" className="text-[15px] text-stone hover:text-ink">
          Cancel
        </Link>

        {post?.status === "published" && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="ml-auto text-[15px] text-stone hover:text-red-primary"
          >
            View the live post ↗
          </Link>
        )}
      </div>
    </form>
  );
}
