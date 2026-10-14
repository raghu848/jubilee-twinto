# Jubilee Sales

Marketing website and admin dashboard for a South Indian property developer.
Next.js (App Router) + Tailwind CSS v4, with a swappable data layer so it runs
immediately with no infrastructure and moves to Postgres by setting one
environment variable.

```bash
npm install
npm run dev        # http://localhost:3000
```

Dashboard: <http://localhost:3000/dashboard> — in development, sign in with
`admin@jubileesales.in` / `jubilee-dev`. That account does not exist in
production; see **Team accounts** below.

---

## Images

**There is no photography in this repository, by design.** Every picture on the
site is an `ImageSlot` ([components/image-slot.tsx](components/image-slot.tsx)).
An empty slot renders as a tonal frame that names the shot that belongs in it
and its target dimensions, so the layout holds its exact proportions and Jubilee
Sales can see precisely what to commission. Upload a file against that slot in
the dashboard and the same component shows the photograph instead.

The homepage hero expects **two** images — one by day, one by night. The toggle
under the headline switches between them.

## Pages

| Route | What it is |
|---|---|
| `/` | Hero with the day/night switch, company statement, featured projects, proof points, flagship deep-dive, locations, enquiry band |
| `/projects` | All projects, filterable by type, city and status (filters live in the URL) |
| `/projects/[slug]` | Full project: gallery with lightbox, specification, configurations, amenities, enquiry form, map |
| `/blog` | Posts, filterable by category — a lead story and a grid |
| `/blog/[slug]` | Single post; drafts are invisible even with the link |
| `/about` | Company story, dated milestones, how we work, leadership |
| `/contact` | Phone, WhatsApp, email, offices, enquiry form, map |
| `/login` → `/dashboard/*` | Team-only admin |

## Dashboard

- **Overview** — new enquiries, this week, totals, recent activity.
- **Projects** — add and edit projects; drag-and-drop photo and video upload
  with reordering.
- **Blog** — write posts as a stack of blocks: paragraphs, subheadings, pull
  quotes, bulleted lists and **images placed anywhere in the flow of the
  writing**. Upload a cover and inline pictures straight from the editor, set a
  category and date, link a post to a project, and keep it as a draft until it
  is ready. Nothing typed is rendered as markup, so an editor cannot inject HTML.
- **Leads** — every enquiry from anywhere on the site, filterable by status,
  project and date, with inline status changes and CSV export.
- **Settings** — how this installation is configured.

Every public enquiry form — homepage, flagship block, project pages and the
contact page — writes through one server action
([app/actions/leads.ts](app/actions/leads.ts)) into a single leads table.

## Data

`lib/store.ts` is the only module that touches storage. Two drivers:

- **No `DATABASE_URL`** — JSON files under `.data/`. Zero setup; good for local
  work and for showing the client the site before infrastructure exists.
- **`DATABASE_URL` set** — Postgres (Supabase, Neon, any PG).

```bash
DATABASE_URL="postgresql://…" npm run db:init   # creates tables, loads seed
```

Nothing above the store changes when you switch.

## Media storage

- **No Cloudinary variables** — uploads are written to `public/uploads`. Fine
  locally; it will not survive a deploy on a read-only host such as Vercel.
- **`CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_UPLOAD_PRESET`** — uploads go straight
  to Cloudinary and never touch the repo.

SVG uploads are rejected: the files are served from the site's own origin and
SVG can carry script.

## Team accounts

Auth covers `/dashboard` only. Accounts live in an environment variable so the
client can add or remove a colleague without a migration and no visitor can ever
create one:

```
JUBILEE_TEAM_ACCOUNTS="asha@jubileesales.in:…,ravi@jubileesales.in:…"
JUBILEE_SESSION_SECRET="<32+ random characters>"
```

Both are **required in production** — logins are refused without them. Sessions
are signed, HTTP-only, and last twelve hours. Every mutating server action
re-checks the session itself rather than trusting the layout, so a stale tab
cannot write after it expires.

Copy `.env.example` to `.env.local` to get started.

## Content the client still owns

Full list with priorities: [CLIENT-CHECKLIST.md](CLIENT-CHECKLIST.md).

Deliberately left blank rather than invented:

- **Photography and video** — every `ImageSlot`, as above.
- **RERA registration numbers** — `reraId` is empty on every project; pages say
  the number is available on request until one is entered.
- **Testimonials** — `lib/testimonials.ts` is an empty array. Add real,
  attributed quotes and the homepage section publishes itself; while it is
  empty the section is hidden in production.
- **Leadership** — names and portraits on `/about` are bracketed placeholders.
- **Company details** — phone, email, address and hours live in `lib/site.ts`,
  in one place so a change reaches every page.

Project copy, prices and localities are written in a developer's voice as
realistic stand-ins, not Lorem ipsum, so the client can judge the layout. They
are placeholders and should be replaced.

## Design notes

- Tokens (`app/globals.css`): paper `#FBF9F8`, red `#A32638`, deep red
  `#6F1522`, ink `#1C1917`, stone `#6B645F`, hairline `#E7E1DD`.
- Type: **Bodoni Moda** for display, **Inter** for UI, **Pinyon Script** for
  single accent words only.
- Motion: one choreographed entrance per page, plus scroll reveals and
  interaction states. `prefers-reduced-motion` disables all of it.

## Deploying

Vercel is the natural fit. Set `JUBILEE_TEAM_ACCOUNTS`, `JUBILEE_SESSION_SECRET`,
`DATABASE_URL` and the Cloudinary pair, then run `npm run db:init` once against
the production database.
