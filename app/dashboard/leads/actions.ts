"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { updateLeadStatus } from "@/lib/store";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

export async function setLeadStatus(id: string, status: string) {
  // Re-checked here rather than trusting the layout: a server action is a
  // public endpoint, reachable without ever rendering the dashboard.
  await requireSession();

  if (!LEAD_STATUSES.includes(status as LeadStatus)) {
    throw new Error(`Unknown lead status: ${status}`);
  }

  await updateLeadStatus(id, status as LeadStatus);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
}
