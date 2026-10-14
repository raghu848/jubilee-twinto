"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { deletePost, getPostById, listPosts, newId, savePost } from "@/lib/store";
import { slugify } from "@/lib/format";
import type { Post, PostBlock } from "@/lib/types";
import type { PostFormState } from "@/lib/post-form";

const blockSchema = z.array(
  z.union([
    z.object({
      id: z.string().min(1),
      kind: z.enum(["heading", "paragraph", "quote", "list"]),
      text: z.string().default(""),
    }),
    z.object({
      id: z.string().min(1),
      kind: z.literal("image"),
      url: z.string().default(""),
      alt: z.string().default(""),
    }),
  ]),
);

const schema = z.object({
  id: z.string().optional().default(""),
  title: z.string().trim().min(4, "Give the post a title"),
  slug: z.string().trim().optional().default(""),
  excerpt: z
    .string()
    .trim()
    .min(20, "Write a sentence or two — it is what shows on the blog index")
    .max(400),
  category: z.string().trim().min(2, "Choose a category"),
  author: z.string().trim().min(2, "Who wrote this?"),
  coverImage: z.string().trim().default(""),
  coverAlt: z.string().trim().default(""),
  projectSlug: z.string().trim().optional().default(""),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().trim().optional().default(""),
});

function parseJson<T>(value: FormDataEntryValue | null, fallback: T): T {
  try {
    return value ? (JSON.parse(String(value)) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function savePostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireSession();

  const parsed = schema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    category: formData.get("category") ?? "",
    author: formData.get("author") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    coverAlt: formData.get("coverAlt") ?? "",
    projectSlug: formData.get("projectSlug") ?? "",
    status: formData.get("status") ?? "draft",
    publishedAt: formData.get("publishedAt") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;
  const existing = data.id ? await getPostById(data.id) : null;
  const all = await listPosts();

  // The slug is the post's public URL, so it has to be unique.
  const base = slugify(data.slug || data.title) || "post";
  let slug = base;
  let n = 2;
  while (all.some((p) => p.slug === slug && p.id !== existing?.id)) {
    slug = `${base}-${n++}`;
  }

  const blocks = blockSchema.safeParse(parseJson(formData.get("blocks"), []));
  const body: PostBlock[] = blocks.success
    ? (blocks.data as PostBlock[]).filter((b) =>
        b.kind === "image" ? b.url || b.alt : b.text.trim(),
      )
    : (existing?.blocks ?? []);

  if (body.length === 0) {
    return {
      status: "error",
      message: "The post is empty — add at least one paragraph before saving.",
      fieldErrors: {},
    };
  }

  // A date typed as YYYY-MM-DD becomes midnight IST rather than midnight UTC,
  // so a post dated today does not appear as yesterday for readers in India.
  const publishedAt = data.publishedAt
    ? new Date(`${data.publishedAt}T00:00:00+05:30`).toISOString()
    : (existing?.publishedAt ?? new Date().toISOString());

  const post: Post = {
    id: existing?.id ?? newId("post"),
    slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    author: data.author,
    coverImage: data.coverImage,
    coverAlt: data.coverAlt,
    blocks: body,
    projectSlug: data.projectSlug || null,
    status: data.status,
    publishedAt,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await savePost(post);

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  if (existing && existing.slug !== post.slug) revalidatePath(`/blog/${existing.slug}`);
  revalidatePath("/dashboard/blog");

  redirect(`/dashboard/blog?saved=${encodeURIComponent(post.title)}`);
}

export async function deletePostAction(formData: FormData) {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const post = await getPostById(id);
  if (!post) redirect("/dashboard/blog");

  await deletePost(id);

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/dashboard/blog");

  redirect(`/dashboard/blog?deleted=${encodeURIComponent(post.title)}`);
}
