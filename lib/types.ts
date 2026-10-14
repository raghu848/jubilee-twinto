export type ProjectType = "plots" | "apartments" | "villas" | "commercial";
export type ProjectStatus = "upcoming" | "ongoing" | "ready";
export type LeadStatus = "new" | "contacted" | "closed";

/**
 * A slot in a project's gallery. `url` is empty until Jubilee Sales uploads the
 * photograph; `alt` doubles as the brief for the shot, so an empty slot tells
 * the client exactly which image is missing.
 */
export type MediaItem = {
  id: string;
  url: string;
  kind: "image" | "video";
  alt: string;
};

export type Spec = { label: string; value: string };

export type Project = {
  id: string;
  slug: string;
  name: string;
  city: string;
  locality: string;
  type: ProjectType;
  status: ProjectStatus;
  tagline: string;
  description: string;
  priceFrom: string;
  configurations: string[];
  specs: Spec[];
  amenities: string[];
  reraId: string;
  heroImage: string;
  gallery: MediaItem[];
  flagship: boolean;
  mapQuery: string;
  createdAt: string;
  updatedAt: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  projectSlug: string | null;
  projectName: string;
  sourcePage: string;
  status: LeadStatus;
  createdAt: string;
};

export const PROJECT_TYPES: ProjectType[] = ["plots", "apartments", "villas", "commercial"];
export const PROJECT_STATUSES: ProjectStatus[] = ["upcoming", "ongoing", "ready"];
export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

export const TYPE_LABEL: Record<ProjectType, string> = {
  plots: "Plotted development",
  apartments: "Apartments",
  villas: "Villas",
  commercial: "Commercial",
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  upcoming: "Launching soon",
  ongoing: "Under construction",
  ready: "Ready to move",
};


/* --------------------------------------------------------------- blog ---- */

export type PostStatus = "draft" | "published";

/**
 * Posts are stored as ordered blocks rather than a blob of HTML or Markdown.
 * The team writes in the dashboard, images sit in the flow as first-class
 * blocks, and nothing user-entered is ever rendered as markup.
 */
export type PostBlock =
  | { id: string; kind: "heading"; text: string }
  | { id: string; kind: "paragraph"; text: string }
  | { id: string; kind: "quote"; text: string }
  | { id: string; kind: "list"; text: string }
  | { id: string; kind: "image"; url: string; alt: string };

export type PostBlockKind = PostBlock["kind"];

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  coverImage: string;
  coverAlt: string;
  blocks: PostBlock[];
  /** Optional link back to the project a post is about. */
  projectSlug: string | null;
  status: PostStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export const POST_STATUSES: PostStatus[] = ["draft", "published"];

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  draft: "Draft",
  published: "Published",
};

export const POST_BLOCK_KINDS: PostBlockKind[] = [
  "paragraph",
  "heading",
  "image",
  "quote",
  "list",
];

export const POST_BLOCK_LABEL: Record<PostBlockKind, string> = {
  paragraph: "Paragraph",
  heading: "Subheading",
  image: "Image",
  quote: "Pull quote",
  list: "Bulleted list",
};

/** Categories the team can file a post under. */
export const POST_CATEGORIES = [
  "Construction update",
  "Handover",
  "New launch",
  "Buying guide",
  "Company news",
] as const;

