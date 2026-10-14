import Link from "next/link";
import { ImageSlot } from "@/components/image-slot";
import type { Project, ProjectType } from "@/lib/types";
import { STATUS_LABEL, TYPE_LABEL } from "@/lib/types";

/*
  Card proportions follow the thing being sold rather than a grid rule: towers
  are drawn tall, land is drawn wide. That is what stops a row of projects
  reading as a set of identical tiles.
*/
const ASPECT: Record<ProjectType, string> = {
  apartments: "aspect-[3/4]",
  commercial: "aspect-[3/4]",
  villas: "aspect-[4/3]",
  plots: "aspect-[16/10]",
};

const SIZES: Record<ProjectType, string> = {
  apartments: "(max-width: 768px) 84vw, 26vw",
  commercial: "(max-width: 768px) 84vw, 26vw",
  villas: "(max-width: 768px) 84vw, 34vw",
  plots: "(max-width: 768px) 84vw, 40vw",
};

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative overflow-hidden">
        <div className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          <ImageSlot
            src={project.heroImage || undefined}
            alt={project.gallery[0]?.alt ?? `${project.name} — lead image`}
            aspect={ASPECT[project.type]}
            sizes={SIZES[project.type]}
            priority={priority}
          />
        </div>

        <span className="label absolute left-4 top-4 bg-paper/90 px-3 py-1.5 text-ink backdrop-blur-sm">
          {STATUS_LABEL[project.status]}
        </span>

      </div>

      <div className="mt-5">
        <p className="label text-stone">
          {project.locality}, {project.city} · {TYPE_LABEL[project.type]}
        </p>

        <h3 className="mt-2.5 text-[clamp(1.7rem,2.4vw,2.1rem)] transition-colors duration-300 group-hover:text-red-primary">
          {project.name}
        </h3>

        <p className="measure-tight mt-3 text-[15px] leading-relaxed text-ink/70">
          {project.tagline}
        </p>

        <p className="mt-4 inline-block border-b border-transparent pb-0.5 text-[15px] transition-colors duration-300 group-hover:border-red-primary group-hover:text-red-primary">
          {project.priceFrom === "On request" ? "Pricing on request" : `From ${project.priceFrom}`}
        </p>
      </div>
    </Link>
  );
}
