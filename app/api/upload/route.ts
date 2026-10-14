import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getSession } from "@/lib/auth";

/*
  Media upload for the dashboard.

  With CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET set, files go
  straight to Cloudinary and the repo never sees them. Without those, files are
  written to public/uploads so the dashboard is usable locally — that path does
  not survive a deploy on a read-only filesystem such as Vercel, which is why
  the response says which store was used.
*/

const MAX_BYTES = 60 * 1024 * 1024;

// SVG is deliberately excluded: it can carry script, and these files are
// served from the site's own origin.
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

async function toCloudinary(file: File) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET!;

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", preset);
  body.append("folder", "jubilee-sales");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/auto/upload`, {
    method: "POST",
    body,
  });

  if (!res.ok) {
    throw new Error(`Cloudinary rejected the upload (${res.status})`);
  }

  const json = (await res.json()) as { secure_url: string };
  return json.secure_url;
}

async function toPublicFolder(file: File) {
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });

  const name = `${crypto.randomBytes(10).toString("hex")}.${EXT[file.type] ?? "bin"}`;
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files were sent." }, { status: 400 });
  }

  const useCloudinary = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET,
  );

  const uploaded: { url: string; kind: "image" | "video"; name: string }[] = [];
  const rejected: { name: string; reason: string }[] = [];

  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      rejected.push({
        name: file.name,
        reason: `${file.type || "Unknown file type"} is not accepted. Use JPG, PNG, WebP, AVIF, GIF, MP4, WebM or MOV.`,
      });
      continue;
    }

    if (file.size > MAX_BYTES) {
      rejected.push({
        name: file.name,
        reason: `${(file.size / 1024 / 1024).toFixed(1)} MB is over the 60 MB limit.`,
      });
      continue;
    }

    try {
      const url = useCloudinary ? await toCloudinary(file) : await toPublicFolder(file);
      uploaded.push({
        url,
        kind: file.type.startsWith("video/") ? "video" : "image",
        name: file.name,
      });
    } catch (err) {
      console.error("Upload failed", err);
      rejected.push({
        name: file.name,
        reason: useCloudinary
          ? "Cloudinary refused the upload. Check the cloud name and upload preset."
          : "Could not write the file. On a read-only host, set the Cloudinary environment variables.",
      });
    }
  }

  return NextResponse.json({
    uploaded,
    rejected,
    store: useCloudinary ? "cloudinary" : "local",
  });
}
