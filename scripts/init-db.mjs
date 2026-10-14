/*
  Creates the two tables and loads the seed projects, once.

  Usage:  DATABASE_URL="postgresql://…" npm run db:init

  Safe to re-run: the schema uses IF NOT EXISTS and projects are upserted by id,
  so an existing installation keeps its data.
*/

import pg from "pg";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Nothing to do.");
  process.exit(1);
}

const SCHEMA = `
create table if not exists projects (
  id             text primary key,
  slug           text unique not null,
  name           text not null,
  city           text not null,
  locality       text not null,
  type           text not null,
  status         text not null,
  tagline        text not null default '',
  description    text not null default '',
  price_from     text not null default '',
  configurations jsonb not null default '[]'::jsonb,
  specs          jsonb not null default '[]'::jsonb,
  amenities      jsonb not null default '[]'::jsonb,
  rera_id        text not null default '',
  hero_image     text not null default '',
  gallery        jsonb not null default '[]'::jsonb,
  flagship       boolean not null default false,
  map_query      text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists leads (
  id           text primary key,
  name         text not null,
  phone        text not null,
  email        text not null default '',
  message      text not null default '',
  project_slug text,
  project_name text not null default '',
  source_page  text not null default '',
  status       text not null default 'new',
  created_at   timestamptz not null default now()
);

create table if not exists posts (
  id           text primary key,
  slug         text unique not null,
  title        text not null,
  excerpt      text not null default '',
  category     text not null default '',
  author       text not null default '',
  cover_image  text not null default '',
  cover_alt    text not null default '',
  blocks       jsonb not null default '[]'::jsonb,
  project_slug text,
  status       text not null default 'draft',
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_published_idx on posts (published_at desc);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
create index if not exists projects_slug_idx on projects (slug);
`;

const pool = new pg.Pool({
  connectionString: url,
  ssl: url.includes("sslmode=disable") ? undefined : { rejectUnauthorized: false },
});

/*
  The seed lives in TypeScript for the app. Rather than pull in a TS loader
  here, read whatever the local JSON store already holds; if that file does not
  exist yet, run the site once (or `npm run dev`) to create it.
*/
function seedProjects() {
  try {
    return JSON.parse(readFileSync(new URL("../.data/projects.json", import.meta.url), "utf8"));
  } catch {
    return [];
  }
}

try {
  await pool.query(SCHEMA);
  console.log("Schema is in place.");

  const projects = seedProjects();
  for (const p of projects) {
    await pool.query(
      `insert into projects (
         id, slug, name, city, locality, type, status, tagline, description,
         price_from, configurations, specs, amenities, rera_id, hero_image,
         gallery, flagship, map_query, created_at, updated_at
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       on conflict (id) do nothing`,
      [
        p.id, p.slug, p.name, p.city, p.locality, p.type, p.status, p.tagline,
        p.description, p.priceFrom, JSON.stringify(p.configurations),
        JSON.stringify(p.specs), JSON.stringify(p.amenities), p.reraId,
        p.heroImage, JSON.stringify(p.gallery), p.flagship, p.mapQuery,
        p.createdAt, p.updatedAt,
      ],
    );
  }

  const { rows } = await pool.query("select count(*)::int as n from projects");
  console.log(
    projects.length
      ? `Loaded ${projects.length} project(s) from .data/. Table now holds ${rows[0].n}.`
      : `No .data/projects.json found — schema created, ${rows[0].n} project(s) in the table.`,
  );
} catch (err) {
  console.error("Database setup failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
