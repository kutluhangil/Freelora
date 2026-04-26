"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { NotificationType } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createNotificationForUser(
  client: SupabaseClient,
  userId: string,
  payload: {
    type: NotificationType;
    title: string;
    message?: string;
    href?: string;
  }
) {
  await client.from("notifications").insert({
    user_id: userId,
    type: payload.type,
    title: payload.title,
    message: payload.message ?? null,
    href: payload.href ?? null,
  });
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/[locale]/(dashboard)", "layout");
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  revalidatePath("/[locale]/(dashboard)", "layout");
}
