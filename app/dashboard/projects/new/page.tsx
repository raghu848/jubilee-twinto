import Link from "next/link";
import { ProjectForm } from "@/components/dashboard/project-form";

export const metadata = { title: "Add a project" };

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/dashboard/projects" className="link-underline pb-0.5 text-[15px] text-stone">
        ← Projects
      </Link>
      <h1 className="mt-6 text-[clamp(2rem,4vw,3rem)]">Add a project</h1>
      <p className="measure mt-3 text-[16px] leading-relaxed text-stone">
        It goes live on the website as soon as you publish it. Photographs can be
        added now or later.
      </p>

      <ProjectForm />
    </div>
  );
}
