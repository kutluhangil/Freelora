"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { transactionSchema } from "@/lib/utils/validation";
import { z } from "zod";

export async function createTransaction(input: z.infer<typeof transactionSchema>) {
  const parsed = transactionSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get exchange rate to base currency
  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_currency")
    .eq("id", user.id)
    .maybeSingle();
  const base = profile?.preferred_currency ?? "TRY";

  let exchangeRate = 1;
  let amountInBase = parsed.amount;
  if (parsed.currency !== base) {
    // Use stored USD rates as bridge
    const { data: rates } = await supabase
      .from("exchange_rates")
      .select("target_currency,rate")
      .eq("base_currency", "USD");
    const map = new Map((rates ?? []).map((r) => [r.target_currency, Number(r.rate)]));
    const fromUsd = map.get(parsed.currency) ?? 1;
    const baseUsd = map.get(base) ?? 1;
    if (fromUsd && baseUsd) {
      exchangeRate = baseUsd / fromUsd;
      amountInBase = parsed.amount * exchangeRate;
    }
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      ...parsed,
      user_id: user.id,
      exchange_rate: exchangeRate,
      amount_in_base: amountInBase,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/[locale]/(dashboard)", "layout");
  return data;
}

export async function updateTransaction(id: string, input: z.infer<typeof transactionSchema>) {
  const parsed = transactionSchema.parse(input);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update(parsed)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)", "layout");
  return data;
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)", "layout");
}
