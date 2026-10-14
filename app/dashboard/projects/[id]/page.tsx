import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/dashboard/project-form";
import { getProjectById } from "@/lib/store";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  return { title: project ? `Edit ${project.name}` : "Project not found" };
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div>
      <Link href="/dashboard/projects" className="link-underline pb-0.5 text-[15px] text-stone">
        ← Projects
      </Link>
      <h1 className="mt-6 text-[clamp(2rem,4vw,3rem)]">{project.name}</h1>
      <p className="mt-3 text-[15px] text-stone">
        Last saved {formatDateTime(project.updatedAt)}
      </p>

      <ProjectForm project={project} />
    </div>
  );
}
