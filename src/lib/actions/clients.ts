"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { clientSchema } from "@/lib/utils/validation";
import { z } from "zod";

export async function createClientAction(input: z.infer<typeof clientSchema>) {
  const parsed = clientSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data, error } = await supabase
    .from("clients")
    .insert({ ...parsed, user_id: user.id })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/clients", "page");
  return data;
}

export async function updateClient(id: string, input: z.infer<typeof clientSchema>) {
  const parsed = clientSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data, error } = await supabase
    .from("clients")
    .update(parsed)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/clients", "page");
  return data;
}

export async function deleteClient(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/clients", "page");
}
