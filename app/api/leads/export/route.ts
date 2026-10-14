import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listLeads, type LeadFilter } from "@/lib/store";
import type { LeadStatus } from "@/lib/types";

/**
 * Escapes a CSV field. The leading apostrophe on formula characters stops a
 * spreadsheet treating a lead's message as a formula when the file is opened.
 */
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  if (!(await getSession())) {
    return new NextResponse("Not authorised", { status: 401 });
  }

  const url = new URL(request.url);
  const filter: LeadFilter = {
    status: (url.searchParams.get("status") as LeadStatus) ?? "all",
    projectSlug: url.searchParams.get("project") ?? "all",
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  };

  const leads = await listLeads(filter);

  const header = [
    "Received",
    "Name",
    "Phone",
    "Email",
    "Project",
    "Source page",
    "Status",
    "Message",
  ];

  const rows = leads.map((l) =>
    [
      l.createdAt,
      l.name,
      l.phone,
      l.email,
      l.projectName,
      l.sourcePage,
      l.status,
      l.message,
    ]
      .map((v) => csvCell(String(v ?? "")))
      .join(","),
  );

  // BOM so Excel opens the file as UTF-8 and does not mangle the rupee sign.
  const csv = `﻿${header.map(csvCell).join(",")}\n${rows.join("\n")}\n`;
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="jubilee-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
