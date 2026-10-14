import Image from "next/image";
import Link from "next/link";
import { listProjects } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { STATUS_LABEL, TYPE_LABEL } from "@/lib/types";
import { ConfirmButton } from "@/components/dashboard/confirm-button";
import { deleteProjectAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const projects = await listProjects();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[clamp(2rem,4vw,3rem)]">Projects</h1>
          <p className="measure mt-3 text-[16px] leading-relaxed text-stone">
            Everything published on the website. Changes appear on the public
            pages as soon as you save.
          </p>
        </div>

        <Link
          href="/dashboard/projects/new"
          className="bg-red-primary px-6 py-3 text-[15px] text-white transition-colors hover:bg-red-deep"
        >
          Add a project
        </Link>
      </div>

      {(saved || deleted) && (
        <p
          role="status"
          className="mt-8 border-l-2 border-red-primary py-2 pl-5 text-[16px]"
        >
          {saved ? `${saved} has been saved.` : `${deleted} has been removed from the website.`}
        </p>
      )}

      <ul className="mt-10 border-t border-hairline">
        {projects.map((project) => (
          <li key={project.id} className="border-b border-hairline py-6">
            <div className="flex flex-wrap items-start gap-6">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden border border-hairline bg-white">
                {project.heroImage ? (
                  <Image
                    src={project.heroImage}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[13px] text-stone">
                    No image
                  </span>
                )}
              </div>

              <div className="min-w-[240px] flex-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="font-display text-[24px] transition-colors hover:text-red-primary"
                  >
                    {project.name}
                  </Link>
                  {project.flagship && (
                    <span className="text-[13px] text-red-primary">On the homepage</span>
                  )}
                </div>

                <p className="mt-1.5 text-[15px] text-stone">
                  {project.locality}, {project.city} · {TYPE_LABEL[project.type]} ·{" "}
                  {STATUS_LABEL[project.status]}
                </p>
                <p className="mt-1 text-[14px] text-stone">
                  {project.gallery.length} {project.gallery.length === 1 ? "file" : "files"} ·
                  Updated {formatDate(project.updatedAt)} · /projects/{project.slug}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="border border-hairline px-4 py-2 text-[14px] transition-colors hover:border-red-primary hover:text-red-primary"
                >
                  Edit
                </Link>
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  className="border border-hairline px-4 py-2 text-[14px] transition-colors hover:border-red-primary hover:text-red-primary"
                >
                  View ↗
                </Link>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <ConfirmButton
                    confirmLabel="Click again to remove"
                    className="border border-hairline px-4 py-2 text-[14px] text-stone transition-colors hover:border-red-primary hover:text-red-primary"
                  >
                    Remove
                  </ConfirmButton>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {projects.length === 0 && (
        <p className="mt-10 text-[17px] leading-relaxed text-stone">
          No projects yet. Add the first one and it appears on the website
          immediately.
        </p>
      )}
    </div>
  );
}
