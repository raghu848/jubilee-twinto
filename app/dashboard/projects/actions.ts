"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { deleteProject, getProjectById, listProjects, newId, saveProject } from "@/lib/store";
import { slugify } from "@/lib/format";
import { PROJECT_STATUSES, PROJECT_TYPES, type MediaItem, type Project } from "@/lib/types";
import type { ProjectFormState } from "@/lib/project-form";

const mediaSchema = z.array(
  z.object({
    id: z.string(),
    // Empty is valid: a slot can exist as a brief before the file arrives.
    url: z.string().default(""),
    kind: z.enum(["image", "video"]),
    alt: z.string().default(""),
  }),
);

const specSchema = z.array(z.object({ label: z.string(), value: z.string() }));


const schema = z.object({
  id: z.string().optional().default(""),
  name: z.string().trim().min(2, "Give the project a name"),
  slug: z.string().trim().optional().default(""),
  city: z.string().trim().min(2, "Which city is this in?"),
  locality: z.string().trim().min(2, "Which locality is this in?"),
  type: z.enum(PROJECT_TYPES as [string, ...string[]]),
  status: z.enum(PROJECT_STATUSES as [string, ...string[]]),
  tagline: z.string().trim().min(10, "Write one line a buyer would recognise the project by"),
  description: z.string().trim().min(20, "Write at least a short paragraph"),
  priceFrom: z.string().trim().default("On request"),
  reraId: z.string().trim().default(""),
  mapQuery: z.string().trim().default(""),
  flagship: z.boolean().default(false),
});

/** Textareas collect one item per line; blank lines are dropped. */
function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseJson<T>(value: FormDataEntryValue | null, fallback: T): T {
  try {
    return value ? (JSON.parse(String(value)) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function saveProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireSession();

  const parsed = schema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name") ?? "",
    slug: formData.get("slug") ?? "",
    city: formData.get("city") ?? "",
    locality: formData.get("locality") ?? "",
    type: formData.get("type") ?? "apartments",
    status: formData.get("status") ?? "upcoming",
    tagline: formData.get("tagline") ?? "",
    description: formData.get("description") ?? "",
    priceFrom: formData.get("priceFrom") ?? "",
    reraId: formData.get("reraId") ?? "",
    mapQuery: formData.get("mapQuery") ?? "",
    flagship: formData.get("flagship") === "on",
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
  const existing = data.id ? await getProjectById(data.id) : null;
  const all = await listProjects();

  // Slug must be unique — it is the public URL of the project page.
  const base = slugify(data.slug || data.name) || "project";
  let slug = base;
  let n = 2;
  while (all.some((p) => p.slug === slug && p.id !== existing?.id)) {
    slug = `${base}-${n++}`;
  }

  const gallery = mediaSchema.safeParse(parseJson(formData.get("gallery"), []));
  const specs = specSchema.safeParse(parseJson(formData.get("specs"), []));

  const media: MediaItem[] = gallery.success ? gallery.data : (existing?.gallery ?? []);

  const project: Project = {
    id: existing?.id ?? newId("prj"),
    slug,
    name: data.name,
    city: data.city,
    locality: data.locality,
    type: data.type as Project["type"],
    status: data.status as Project["status"],
    tagline: data.tagline,
    description: data.description,
    priceFrom: data.priceFrom || "On request",
    configurations: lines(formData.get("configurations")),
    specs: specs.success ? specs.data.filter((s) => s.label || s.value) : (existing?.specs ?? []),
    amenities: lines(formData.get("amenities")),
    reraId: data.reraId,
    heroImage: media.find((m) => m.kind === "image")?.url ?? existing?.heroImage ?? "",
    gallery: media,
    flagship: data.flagship,
    mapQuery: data.mapQuery || `${data.locality}, ${data.city}`,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Only one project can be the homepage flagship.
  if (project.flagship) {
    for (const other of all) {
      if (other.id !== project.id && other.flagship) {
        await saveProject({ ...other, flagship: false });
      }
    }
  }

  await saveProject(project);

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  if (existing && existing.slug !== project.slug) revalidatePath(`/projects/${existing.slug}`);
  revalidatePath("/dashboard/projects");

  redirect(`/dashboard/projects?saved=${encodeURIComponent(project.name)}`);
}

export async function deleteProjectAction(formData: FormData) {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const project = await getProjectById(id);
  if (!project) redirect("/dashboard/projects");

  await deleteProject(id);

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/dashboard/projects");

  redirect(`/dashboard/projects?deleted=${encodeURIComponent(project.name)}`);
}
