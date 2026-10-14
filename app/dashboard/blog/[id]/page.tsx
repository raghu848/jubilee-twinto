import Link from "next/link";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/dashboard/post-form";
import { getPostById, listProjects } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { POST_STATUS_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  return { title: post ? `Edit ${post.title}` : "Post not found" };
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, projects] = await Promise.all([getPostById(id), listProjects()]);
  if (!post) notFound();

  return (
    <div>
      <Link href="/dashboard/blog" className="link-underline pb-0.5 text-[15px] text-stone">
        ← Blog
      </Link>
      <h1 className="mt-6 max-w-[24ch] text-[clamp(2rem,4vw,3rem)]">{post.title}</h1>
      <p className="mt-3 text-[15px] text-stone">
        {POST_STATUS_LABEL[post.status]} · last saved {formatDateTime(post.updatedAt)}
      </p>

      <PostForm post={post} projects={projects.map((p) => ({ slug: p.slug, name: p.name }))} />
    </div>
  );
}
