"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { RecurringInvoiceConfig, ProposalItem } from "@/types/database";
import { z } from "zod";
import { proposalItemSchema } from "@/lib/utils/validation";

export const recurringConfigSchema = z.object({
  client_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1),
  items: z.array(proposalItemSchema).min(1),
  currency: z.string().length(3).default("TRY"),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  discount_rate: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  payment_terms: z.string().optional(),
  interval: z.enum(["monthly", "quarterly", "yearly"]).default("monthly"),
  day_of_month: z.coerce.number().int().min(1).max(28).default(1),
  due_days: z.coerce.number().int().min(1).max(90).default(14),
  is_active: z.boolean().default(true),
});

function calcTotals(
  items: { quantity: number; unit_price: number }[],
  taxRate: number,
  discountRate: number
) {
  const subtotal = items.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_price), 0);
  const discountAmount = subtotal * (discountRate / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxRate / 100);
  return { subtotal, discountAmount, taxAmount, total: afterDiscount + taxAmount };
}

export async function createRecurringConfig(
  input: z.infer<typeof recurringConfigSchema>
): Promise<RecurringInvoiceConfig> {
  const parsed = recurringConfigSchema.parse(input);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const items: ProposalItem[] = parsed.items.map((i) => ({
    description: i.description,
    quantity: Number(i.quantity),
    unit_price: Number(i.unit_price),
    total: Number(i.quantity) * Number(i.unit_price),
  }));

  const { data, error } = await supabase
    .from("recurring_invoice_configs")
    .insert({
      user_id: user.id,
      client_id: parsed.client_id ?? null,
      title: parsed.title,
      items,
      currency: parsed.currency,
      tax_rate: parsed.tax_rate,
      discount_rate: parsed.discount_rate,
      notes: parsed.notes ?? null,
      payment_terms: parsed.payment_terms ?? null,
      interval: parsed.interval,
      day_of_month: parsed.day_of_month,
      due_days: parsed.due_days,
      is_active: parsed.is_active,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/invoices", "page");
  return data as unknown as RecurringInvoiceConfig;
}

export async function updateRecurringConfig(
  id: string,
  input: Partial<z.infer<typeof recurringConfigSchema>>
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const update: Record<string, unknown> = { ...input };
  if (input.items) {
    update.items = input.items.map((i) => ({
      description: i.description,
      quantity: Number(i.quantity),
      unit_price: Number(i.unit_price),
      total: Number(i.quantity) * Number(i.unit_price),
    }));
  }

  const { error } = await supabase
    .from("recurring_invoice_configs")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/invoices", "page");
}

export async function deleteRecurringConfig(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("recurring_invoice_configs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/invoices", "page");
}
