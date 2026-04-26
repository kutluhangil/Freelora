"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { invoiceSchema } from "@/lib/utils/validation";
import { createNotificationForUser } from "@/lib/actions/notifications";
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

export async function createInvoice(input: z.infer<typeof invoiceSchema>) {
  const parsed = invoiceSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { subtotal, discountAmount, taxAmount, total } = calcTotals(
    parsed.items,
    parsed.tax_rate,
    parsed.discount_rate
  );

  const { data: numberRpc } = await supabase.rpc("next_invoice_number", { p_user_id: user.id });
  const invoice_number = (numberRpc as string) ?? `FK-${new Date().getFullYear()}-0001`;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      client_id: parsed.client_id,
      project_id: parsed.project_id ?? null,
      invoice_number,
      issue_date: parsed.issue_date,
      due_date: parsed.due_date,
      currency: parsed.currency,
      subtotal,
      tax_rate: parsed.tax_rate,
      tax_amount: taxAmount,
      discount_rate: parsed.discount_rate,
      discount_amount: discountAmount,
      total,
      notes: parsed.notes,
      payment_terms: parsed.payment_terms,
      status: "draft",
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  const { error: itemsErr } = await supabase.from("invoice_items").insert(
    parsed.items.map((it, idx) => ({
      invoice_id: invoice.id,
      description: it.description,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total: Number(it.quantity) * Number(it.unit_price),
      sort_order: idx,
    }))
  );
  if (itemsErr) throw new Error(itemsErr.message);

  revalidatePath("/[locale]/(dashboard)/invoices", "page");
  return invoice;
}

export async function updateInvoiceStatus(
  id: string,
  status: "draft" | "sent" | "paid" | "overdue" | "canceled"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const update: Record<string, unknown> = { status };
  if (status === "sent") update.sent_at = new Date().toISOString();
  if (status === "paid") update.paid_at = new Date().toISOString();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("invoice_number, total, currency")
    .single();

  if (error) throw new Error(error.message);

  if (status === "paid" && invoice) {
    await createNotificationForUser(supabase, user.id, {
      type: "invoice_paid",
      title: `Fatura ödendi: ${invoice.invoice_number}`,
      message: `${invoice.invoice_number} numaralı fatura ödendi. Tutar: ${invoice.total.toFixed(2)} ${invoice.currency}`,
      href: `/invoices/${id}`,
    });
  }

  revalidatePath("/[locale]/(dashboard)/invoices", "page");
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/(dashboard)/invoices", "page");
}
