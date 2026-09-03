"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession, requireAdmin, verifyAdminCredentials } from "@/lib/admin-auth";
import { isStatus, setInquiryStatus } from "@/lib/inquiries";

export type LoginState = { error?: string; username?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminCredentials(username, password)) {
    // Slow down guessing a little.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "That username or password isn't right.", username };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function updateStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status");
  if (!id || !isStatus(status)) return;
  await setInquiryStatus(id, status);
  revalidatePath("/admin");
}
