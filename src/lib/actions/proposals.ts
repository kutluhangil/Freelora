"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { proposalSchema } from "@/lib/utils/validation";
import type { Proposal, ProposalItem, ProposalStatus } from "@/types/database";
import { z } from "zod";

function calcTotals(
  items: { quantity: number; unit_price: number }[],
  taxRate: number,
  discountRate: number
) {
  const subtotal = items.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_price), 0);
  const discountAmount = subtotal * (discountRate / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;
  return { subtotal, discountAmount, taxAmount, total };
}

export async function createProposal(input: z.infer<typeof proposalSchema>): Promise<Proposal> {
  const parsed = proposalSchema.parse(input);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { subtotal, discountAmount, taxAmount, total } = calcTotals(
    parsed.items,
    parsed.tax_rate,
    parsed.discount_rate
  );

  const items: ProposalItem[] = parsed.items.map((i) => ({
    description: i.description,
    quantity: Number(i.quantity),
    unit_price: Number(i.unit_price),
    total: Number(i.quantity) * Number(i.unit_price),
  }));

  const { data, error } = await supabase
    .from("proposals")
    .insert({
      user_id: user.id,
      client_id: parsed.client_id ?? null,
      title: parsed.title,
      items,
      subtotal,
      tax_rate: parsed.tax_rate,
      tax_amount: taxAmount,
      discount_rate: parsed.discount_rate,
      discount_amount: discountAmount,
      total,
      currency: parsed.currency,
      valid_until: parsed.valid_until ?? null,
      notes: parsed.notes ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/proposals", "page");
  return data as unknown as Proposal;
}

export async function updateProposal(
  id: string,
  input: z.infer<typeof proposalSchema>
): Promise<void> {
  const parsed = proposalSchema.parse(input);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { subtotal, discountAmount, taxAmount, total } = calcTotals(
    parsed.items,
    parsed.tax_rate,
    parsed.discount_rate
  );

  const items: ProposalItem[] = parsed.items.map((i) => ({
    description: i.description,
    quantity: Number(i.quantity),
    unit_price: Number(i.unit_price),
    total: Number(i.quantity) * Number(i.unit_price),
  }));

  const { error } = await supabase
    .from("proposals")
    .update({
      client_id: parsed.client_id ?? null,
      title: parsed.title,
      items,
      subtotal,
      tax_rate: parsed.tax_rate,
      tax_amount: taxAmount,
      discount_rate: parsed.discount_rate,
      discount_amount: discountAmount,
      total,
      currency: parsed.currency,
      valid_until: parsed.valid_until ?? null,
      notes: parsed.notes ?? null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/proposals", "page");
}

export async function updateProposalStatus(id: string, status: ProposalStatus): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("proposals")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/proposals", "page");
}

export async function deleteProposal(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("proposals").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/proposals", "page");
}

export async function convertProposalToInvoice(proposalId: string): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", proposalId)
    .eq("user_id", user.id)
    .single();

  if (!proposal) throw new Error("Proposal not found");

  const items = (proposal.items as ProposalItem[]);

  const { data: numberRpc } = await supabase.rpc("next_invoice_number", { p_user_id: user.id });
  const invoice_number = (numberRpc as string) ?? `FK-${new Date().getFullYear()}-0001`;

  const today = new Date().toISOString().split("T")[0];
  const due = new Date();
  due.setDate(due.getDate() + 14);

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      client_id: proposal.client_id ?? null,
      invoice_number,
      issue_date: today,
      due_date: due.toISOString().split("T")[0],
      currency: proposal.currency,
      subtotal: proposal.subtotal,
      tax_rate: proposal.tax_rate,
      tax_amount: proposal.tax_amount,
      discount_rate: proposal.discount_rate,
      discount_amount: proposal.discount_amount,
      total: proposal.total,
      notes: proposal.notes ?? null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("invoice_items").insert(
    items.map((it, idx) => ({
      invoice_id: invoice.id,
      description: it.description,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total: it.total,
      sort_order: idx,
    }))
  );

  await updateProposalStatus(proposalId, "accepted");

  revalidatePath("/[locale]/(dashboard)/invoices", "page");
  return invoice.id;
}

export async function acceptProposalByToken(token: string): Promise<void> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const { error } = await admin
    .from("proposals")
    .update({ status: "accepted" })
    .eq("public_token", token);
  if (error) throw new Error(error.message);
}
