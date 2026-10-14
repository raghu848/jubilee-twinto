import Link from "next/link";
import { PostForm } from "@/components/dashboard/post-form";
import { listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata = { title: "Write a post" };

export default async function NewPostPage() {
  const projects = await listProjects();

  return (
    <div>
      <Link href="/dashboard/blog" className="link-underline pb-0.5 text-[15px] text-stone">
        ← Blog
      </Link>
      <h1 className="mt-6 text-[clamp(2rem,4vw,3rem)]">Write a post</h1>
      <p className="measure mt-3 text-[16px] leading-relaxed text-stone">
        Save it as a draft while you work. Nothing is visible to the public until
        the status is set to published.
      </p>

      <PostForm projects={projects.map((p) => ({ slug: p.slug, name: p.name }))} />
    </div>
  );
}
