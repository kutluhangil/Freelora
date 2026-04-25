"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateUpcomingTaxDates } from "@/lib/constants/tax-dates";

export async function seedTaxRemindersFromCountry() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("country")
    .eq("id", user.id)
    .maybeSingle();
  const country = profile?.country ?? "TR";

  const upcoming = generateUpcomingTaxDates(country, 6);
  if (!upcoming.length) return 0;

  // Avoid duplicates: filter out if same (user, type, due_date) exists
  const { data: existing } = await supabase
    .from("tax_reminders")
    .select("type,due_date")
    .eq("user_id", user.id);
  const set = new Set((existing ?? []).map((r) => `${r.type}|${r.due_date}`));

  const rows = upcoming
    .filter((u) => !set.has(`${u.type}|${u.due_date}`))
    .map((u) => {
      const reminderDate = new Date(u.due_date);
      reminderDate.setDate(reminderDate.getDate() - 7);
      return {
        user_id: user.id,
        title: u.titleKey,
        description: null,
        due_date: u.due_date,
        reminder_date: reminderDate.toISOString().split("T")[0],
        type: u.type,
        country,
        is_recurring: true,
        recurring_interval: u.recurring_interval,
        is_completed: false,
        notified: false,
      };
    });

  if (rows.length > 0) {
    const { error } = await supabase.from("tax_reminders").insert(rows);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/[locale]/(dashboard)/calendar", "page");
  return rows.length;
}

export async function toggleTaxReminderComplete(id: string, value: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tax_reminders")
    .update({ is_completed: value })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/calendar", "page");
}

export async function addCustomTaxReminder(input: {
  title: string;
  due_date: string;
  description?: string;
  is_recurring?: boolean;
  recurring_interval?: "monthly" | "quarterly" | "yearly";
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const reminderDate = new Date(input.due_date);
  reminderDate.setDate(reminderDate.getDate() - 7);

  const { error } = await supabase.from("tax_reminders").insert({
    user_id: user.id,
    title: input.title,
    description: input.description ?? null,
    due_date: input.due_date,
    reminder_date: reminderDate.toISOString().split("T")[0],
    type: "custom",
    country: "TR",
    is_recurring: input.is_recurring ?? false,
    recurring_interval: input.recurring_interval ?? null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/calendar", "page");
}

export async function deleteTaxReminder(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tax_reminders").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/calendar", "page");
}
