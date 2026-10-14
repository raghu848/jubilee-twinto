"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";
import type { LoginState } from "@/lib/login-form";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email address and password." };
  }

  if (!verifyCredentials(email, password)) {
    // Deliberately does not say which of the two was wrong.
    return { error: "Those details do not match an account." };
  }

  await createSession(email);
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
