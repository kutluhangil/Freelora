"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TimeEntry } from "@/types/database";

export async function startTimer(input: {
  description?: string;
  project_id?: string | null;
  client_id?: string | null;
  hourly_rate?: number | null;
  currency?: string;
}): Promise<TimeEntry> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Stop any running timer first
  await supabase
    .from("time_entries")
    .update({ end_time: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("end_time", null);

  const { data, error } = await supabase
    .from("time_entries")
    .insert({
      user_id: user.id,
      description: input.description ?? "",
      project_id: input.project_id ?? null,
      client_id: input.client_id ?? null,
      hourly_rate: input.hourly_rate ?? null,
      currency: input.currency ?? "TRY",
      start_time: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/time-tracker", "page");
  return data as TimeEntry;
}

export async function stopTimer(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: entry } = await supabase
    .from("time_entries")
    .select("start_time")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!entry) throw new Error("Entry not found");

  const endTime = new Date();
  const startTime = new Date(entry.start_time);
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  const { error } = await supabase
    .from("time_entries")
    .update({ end_time: endTime.toISOString(), duration_minutes: durationMinutes })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/time-tracker", "page");
}

export async function deleteTimeEntry(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("time_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/time-tracker", "page");
}

export async function toggleBilled(id: string, is_billed: boolean): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("time_entries")
    .update({ is_billed })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/time-tracker", "page");
}
