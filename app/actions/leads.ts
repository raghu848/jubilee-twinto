"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createLead, getProjectBySlug } from "@/lib/store";
import type { LeadFormState } from "@/lib/lead-form";

/*
  Every enquiry form on the public site — hero band, flagship mini-form,
  project pages, contact page — submits through this one action, so the
  dashboard leads inbox is genuinely the single place enquiries land.
*/

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a phone number we can reach you on")
    .max(24)
    .regex(/^[0-9+\-\s()]+$/, "Phone number can only contain digits and + - ( )"),
  email: z.union([z.literal(""), z.string().trim().email("That email address looks incomplete")]),
  message: z.string().trim().max(2000).optional().default(""),
  projectSlug: z.string().trim().optional().default(""),
  sourcePage: z.string().trim().max(200).optional().default(""),
});

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot: real people never fill a field that is hidden from them.
  if ((formData.get("company") as string)?.trim()) {
    return { status: "success", message: "Thank you — we have your enquiry.", fieldErrors: {} };
  }

  const parsed = schema.safeParse({
    name: formData.get("name") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
    projectSlug: formData.get("projectSlug") ?? "",
    sourcePage: formData.get("sourcePage") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const project = data.projectSlug ? await getProjectBySlug(data.projectSlug) : null;

  try {
    await createLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      projectSlug: project?.slug ?? null,
      projectName: project?.name ?? "General enquiry",
      sourcePage: data.sourcePage || "/",
    });
  } catch (err) {
    console.error("Failed to save lead", err);
    return {
      status: "error",
      message:
        "We could not save your enquiry just now. Please call us on the number in the footer and we will take your details directly.",
      fieldErrors: {},
    };
  }

  revalidatePath("/dashboard/leads");

  return {
    status: "success",
    message: project
      ? `Thank you. A member of our ${project.name} team will call you within one working day.`
      : "Thank you. Someone from our sales team will call you within one working day.",
    fieldErrors: {},
  };
}
