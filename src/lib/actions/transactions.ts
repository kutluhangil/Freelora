"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { transactionSchema } from "@/lib/utils/validation";
import { z } from "zod";

async function resolveExchangeRate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  currency: string,
  baseCurrency: string,
  amount: number
): Promise<{ exchangeRate: number; amountInBase: number }> {
  if (currency === baseCurrency) return { exchangeRate: 1, amountInBase: amount };

  const { data: rates } = await supabase
    .from("exchange_rates")
    .select("target_currency,rate")
    .eq("base_currency", "USD");

  const map = new Map((rates ?? []).map((r) => [r.target_currency, Number(r.rate)]));
  const fromUsd = map.get(currency) ?? 1;
  const baseUsd = map.get(baseCurrency) ?? 1;
  const exchangeRate = baseUsd / fromUsd;
  return { exchangeRate, amountInBase: amount * exchangeRate };
}

export async function createTransaction(input: z.infer<typeof transactionSchema>) {
  const parsed = transactionSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_currency")
    .eq("id", user.id)
    .maybeSingle();
  const base = profile?.preferred_currency ?? "TRY";

  const { exchangeRate, amountInBase } = await resolveExchangeRate(
    supabase,
    parsed.currency,
    base,
    parsed.amount
  );

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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_currency")
    .eq("id", user.id)
    .maybeSingle();
  const base = profile?.preferred_currency ?? "TRY";

  const { exchangeRate, amountInBase } = await resolveExchangeRate(
    supabase,
    parsed.currency,
    base,
    parsed.amount
  );

  const { data, error } = await supabase
    .from("transactions")
    .update({ ...parsed, exchange_rate: exchangeRate, amount_in_base: amountInBase })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)", "layout");
  return data;
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)", "layout");
}
