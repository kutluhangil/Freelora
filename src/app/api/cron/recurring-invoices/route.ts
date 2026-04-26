import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotificationForUser } from "@/lib/actions/notifications";

export const runtime = "nodejs";

function calcTotals(
  items: { quantity: number; unit_price: number }[],
  taxRate: number,
  discountRate: number
) {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const discountAmount = subtotal * (discountRate / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxRate / 100);
  return { subtotal, discountAmount, taxAmount, total: afterDiscount + taxAmount };
}

function shouldGenerate(
  config: { interval: string; day_of_month: number; last_generated_at: string | null },
  today: Date
): boolean {
  if (today.getDate() !== config.day_of_month) return false;

  const month = today.getMonth();

  if (config.interval === "quarterly" && ![0, 3, 6, 9].includes(month)) return false;
  if (config.interval === "yearly" && month !== 0) return false;

  if (!config.last_generated_at) return true;

  const last = new Date(config.last_generated_at);
  const year = today.getFullYear();

  if (config.interval === "monthly") {
    return !(last.getMonth() === month && last.getFullYear() === year);
  }
  if (config.interval === "quarterly") {
    const quarter = Math.floor(month / 3);
    return !(Math.floor(last.getMonth() / 3) === quarter && last.getFullYear() === year);
  }
  if (config.interval === "yearly") {
    return last.getFullYear() !== year;
  }
  return false;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date();
  let generated = 0;

  const { data: configs } = await admin
    .from("recurring_invoice_configs")
    .select("*")
    .eq("is_active", true);

  for (const config of configs ?? []) {
    if (!shouldGenerate(config, today)) continue;

    const { data: invNum } = await admin.rpc("next_invoice_number", {
      p_user_id: config.user_id,
    });
    if (!invNum) continue;

    const issueDate = today.toISOString().split("T")[0];
    const dueDate = new Date(today.getTime() + config.due_days * 86400000)
      .toISOString()
      .split("T")[0];

    const items = config.items as {
      description: string;
      quantity: number;
      unit_price: number;
      total: number;
    }[];
    const { subtotal, discountAmount, taxAmount, total } = calcTotals(
      items,
      config.tax_rate,
      config.discount_rate
    );

    const { data: invoice, error: invErr } = await admin
      .from("invoices")
      .insert({
        user_id: config.user_id,
        client_id: config.client_id,
        invoice_number: invNum as string,
        status: "draft",
        issue_date: issueDate,
        due_date: dueDate,
        currency: config.currency,
        subtotal,
        tax_rate: config.tax_rate,
        tax_amount: taxAmount,
        discount_rate: config.discount_rate,
        discount_amount: discountAmount,
        total,
        notes: config.notes ?? null,
        payment_terms: config.payment_terms ?? null,
      })
      .select("id")
      .single();

    if (invErr || !invoice) continue;

    await admin.from("invoice_items").insert(
      items.map((item, idx) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
        sort_order: idx,
      }))
    );

    await admin
      .from("recurring_invoice_configs")
      .update({ last_generated_at: today.toISOString() })
      .eq("id", config.id);

    await createNotificationForUser(admin, config.user_id, {
      type: "invoice_generated",
      title: `Fatura oluşturuldu: ${config.title}`,
      message: `${invNum} numaralı fatura otomatik olarak oluşturuldu.`,
      href: `/invoices/${invoice.id}`,
    });

    generated++;
  }

  return NextResponse.json({ generated, at: today.toISOString() });
}
