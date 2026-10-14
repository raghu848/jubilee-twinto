import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { Lead, LeadStatus, Post, Project } from "./types";
import { SEED_PROJECTS } from "./seed";
import { SEED_POSTS } from "./blog-seed";

/*
  One data interface, two drivers.

  No DATABASE_URL  -> JSON files under .data/. Zero setup, good for local work
                      and for showing the client the site before infra exists.
  DATABASE_URL set -> Postgres (Supabase, Neon, or any PG). Run `npm run db:init`
                      once to create the tables and load the seed projects.

  Everything above this module (pages, server actions, dashboard) is written
  against the exported functions only, so swapping drivers changes nothing else.
*/

export const usingPostgres = Boolean(process.env.DATABASE_URL);

export function newId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

/* ---------------------------------------------------------------- JSON ---- */

const DATA_DIR = path.join(process.cwd(), ".data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

// Serialise writes so two concurrent form submits cannot clobber each other.
let writeQueue: Promise<unknown> = Promise.resolve();
function queued<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(fn, fn);
  writeQueue = run.catch(() => {});
  return run;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

/* ------------------------------------------------------------ Postgres ---- */

type PgPool = import("pg").Pool;
let pool: PgPool | null = null;

async function db(): Promise<PgPool> {
  if (!pool) {
    const { Pool } = await import("pg");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes("sslmode=disable")
        ? undefined
        : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToProject(r: any): Project {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    city: r.city,
    locality: r.locality,
    type: r.type,
    status: r.status,
    tagline: r.tagline,
    description: r.description,
    priceFrom: r.price_from,
    configurations: r.configurations ?? [],
    specs: r.specs ?? [],
    amenities: r.amenities ?? [],
    reraId: r.rera_id ?? "",
    heroImage: r.hero_image ?? "",
    gallery: r.gallery ?? [],
    flagship: r.flagship,
    mapQuery: r.map_query ?? "",
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

function rowToLead(r: any): Lead {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    message: r.message ?? "",
    projectSlug: r.project_slug,
    projectName: r.project_name ?? "",
    sourcePage: r.source_page ?? "",
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

function rowToPost(r: any): Post {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    category: r.category ?? "",
    author: r.author ?? "",
    coverImage: r.cover_image ?? "",
    coverAlt: r.cover_alt ?? "",
    blocks: r.blocks ?? [],
    projectSlug: r.project_slug,
    status: r.status,
    publishedAt: new Date(r.published_at).toISOString(),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

/* ------------------------------------------------------------ Projects ---- */

export async function listProjects(): Promise<Project[]> {
  if (usingPostgres) {
    const { rows } = await (await db()).query(
      "select * from projects order by flagship desc, created_at desc",
    );
    return rows.map(rowToProject);
  }
  const all = await readJson<Project[]>(PROJECTS_FILE, SEED_PROJECTS);
  return [...all].sort((a, b) => Number(b.flagship) - Number(a.flagship));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await listProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const all = await listProjects();
  return all.find((p) => p.id === id) ?? null;
}

export async function saveProject(project: Project): Promise<Project> {
  const next = { ...project, updatedAt: new Date().toISOString() };

  if (usingPostgres) {
    await (await db()).query(
      `insert into projects (
         id, slug, name, city, locality, type, status, tagline, description,
         price_from, configurations, specs, amenities, rera_id, hero_image,
         gallery, flagship, map_query, created_at, updated_at
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       on conflict (id) do update set
         slug = excluded.slug, name = excluded.name, city = excluded.city,
         locality = excluded.locality, type = excluded.type, status = excluded.status,
         tagline = excluded.tagline, description = excluded.description,
         price_from = excluded.price_from, configurations = excluded.configurations,
         specs = excluded.specs, amenities = excluded.amenities,
         rera_id = excluded.rera_id, hero_image = excluded.hero_image,
         gallery = excluded.gallery, flagship = excluded.flagship,
         map_query = excluded.map_query, updated_at = excluded.updated_at`,
      [
        next.id, next.slug, next.name, next.city, next.locality, next.type,
        next.status, next.tagline, next.description, next.priceFrom,
        JSON.stringify(next.configurations), JSON.stringify(next.specs),
        JSON.stringify(next.amenities), next.reraId, next.heroImage,
        JSON.stringify(next.gallery), next.flagship, next.mapQuery,
        next.createdAt, next.updatedAt,
      ],
    );
    return next;
  }

  return queued(async () => {
    const all = await readJson<Project[]>(PROJECTS_FILE, SEED_PROJECTS);
    const i = all.findIndex((p) => p.id === next.id);
    if (i >= 0) all[i] = next;
    else all.unshift(next);
    await writeJson(PROJECTS_FILE, all);
    return next;
  });
}

export async function deleteProject(id: string): Promise<void> {
  if (usingPostgres) {
    await (await db()).query("delete from projects where id = $1", [id]);
    return;
  }
  await queued(async () => {
    const all = await readJson<Project[]>(PROJECTS_FILE, SEED_PROJECTS);
    await writeJson(PROJECTS_FILE, all.filter((p) => p.id !== id));
  });
}

/* --------------------------------------------------------------- Leads ---- */

export type LeadFilter = {
  status?: LeadStatus | "all";
  projectSlug?: string | "all";
  from?: string;
  to?: string;
};

export async function listLeads(filter: LeadFilter = {}): Promise<Lead[]> {
  let leads: Lead[];

  if (usingPostgres) {
    const { rows } = await (await db()).query("select * from leads order by created_at desc");
    leads = rows.map(rowToLead);
  } else {
    leads = await readJson<Lead[]>(LEADS_FILE, []);
    leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return leads.filter((l) => {
    if (filter.status && filter.status !== "all" && l.status !== filter.status) return false;
    if (filter.projectSlug && filter.projectSlug !== "all" && l.projectSlug !== filter.projectSlug) return false;
    if (filter.from && l.createdAt < filter.from) return false;
    if (filter.to && l.createdAt > `${filter.to}T23:59:59.999Z`) return false;
    return true;
  });
}

export async function createLead(
  input: Omit<Lead, "id" | "createdAt" | "status"> & { status?: LeadStatus },
): Promise<Lead> {
  const lead: Lead = {
    ...input,
    id: newId("lead"),
    status: input.status ?? "new",
    createdAt: new Date().toISOString(),
  };

  if (usingPostgres) {
    await (await db()).query(
      `insert into leads (id, name, phone, email, message, project_slug,
                          project_name, source_page, status, created_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        lead.id, lead.name, lead.phone, lead.email, lead.message, lead.projectSlug,
        lead.projectName, lead.sourcePage, lead.status, lead.createdAt,
      ],
    );
    return lead;
  }

  return queued(async () => {
    const all = await readJson<Lead[]>(LEADS_FILE, []);
    all.unshift(lead);
    await writeJson(LEADS_FILE, all);
    return lead;
  });
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (usingPostgres) {
    await (await db()).query("update leads set status = $1 where id = $2", [status, id]);
    return;
  }
  await queued(async () => {
    const all = await readJson<Lead[]>(LEADS_FILE, []);
    const i = all.findIndex((l) => l.id === id);
    if (i >= 0) {
      all[i] = { ...all[i], status };
      await writeJson(LEADS_FILE, all);
    }
  });
}

/* ---------------------------------------------------------------- Blog ---- */

/** Newest first. Drafts are included; public pages filter them out. */
export async function listPosts(): Promise<Post[]> {
  if (usingPostgres) {
    const { rows } = await (await db()).query(
      "select * from posts order by published_at desc",
    );
    return rows.map(rowToPost);
  }
  const all = await readJson<Post[]>(POSTS_FILE, SEED_POSTS);
  return [...all].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function listPublishedPosts(): Promise<Post[]> {
  const all = await listPosts();
  return all.filter((p) => p.status === "published");
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await listPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getPostById(id: string): Promise<Post | null> {
  const all = await listPosts();
  return all.find((p) => p.id === id) ?? null;
}

export async function savePost(post: Post): Promise<Post> {
  const next = { ...post, updatedAt: new Date().toISOString() };

  if (usingPostgres) {
    await (await db()).query(
      `insert into posts (
         id, slug, title, excerpt, category, author, cover_image, cover_alt,
         blocks, project_slug, status, published_at, created_at, updated_at
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       on conflict (id) do update set
         slug = excluded.slug, title = excluded.title, excerpt = excluded.excerpt,
         category = excluded.category, author = excluded.author,
         cover_image = excluded.cover_image, cover_alt = excluded.cover_alt,
         blocks = excluded.blocks, project_slug = excluded.project_slug,
         status = excluded.status, published_at = excluded.published_at,
         updated_at = excluded.updated_at`,
      [
        next.id, next.slug, next.title, next.excerpt, next.category, next.author,
        next.coverImage, next.coverAlt, JSON.stringify(next.blocks),
        next.projectSlug, next.status, next.publishedAt, next.createdAt,
        next.updatedAt,
      ],
    );
    return next;
  }

  return queued(async () => {
    const all = await readJson<Post[]>(POSTS_FILE, SEED_POSTS);
    const i = all.findIndex((p) => p.id === next.id);
    if (i >= 0) all[i] = next;
    else all.unshift(next);
    await writeJson(POSTS_FILE, all);
    return next;
  });
}

export async function deletePost(id: string): Promise<void> {
  if (usingPostgres) {
    await (await db()).query("delete from posts where id = $1", [id]);
    return;
  }
  await queued(async () => {
    const all = await readJson<Post[]>(POSTS_FILE, SEED_POSTS);
    await writeJson(POSTS_FILE, all.filter((p) => p.id !== id));
  });
}
