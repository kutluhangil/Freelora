"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/utils/validation";
import { z } from "zod";

export async function createProject(input: z.infer<typeof projectSchema>) {
  const parsed = projectSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed, user_id: user.id })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/projects", "page");
  return data;
}

export async function updateProject(id: string, input: z.infer<typeof projectSchema>) {
  const parsed = projectSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data, error } = await supabase
    .from("projects")
    .update(parsed)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/projects", "page");
  return data;
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/projects", "page");
}
