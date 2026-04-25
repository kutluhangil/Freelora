import cron from "node-cron";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function syncExchangeRates() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) return;

  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
  if (!res.ok) {
    console.error("[cron] exchange-rate fetch failed", res.status);
    return;
  }
  const json = await res.json();
  const rates: { base_currency: string; target_currency: string; rate: number; fetched_at: string }[] = [];
  const fetchedAt = new Date().toISOString();
  for (const [code, rate] of Object.entries(json.conversion_rates as Record<string, number>)) {
    if (code === "USD") continue;
    rates.push({ base_currency: "USD", target_currency: code, rate, fetched_at: fetchedAt });
  }
  const { error } = await supabase.from("exchange_rates").upsert(rates, { onConflict: "base_currency,target_currency" });
  if (error) console.error("[cron] exchange-rate upsert error", error.message);
  else console.log(`[cron] synced ${rates.length} exchange rates`);
}

async function sendTaxReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("tax_reminders")
    .select("id, user_id, title, due_date")
    .eq("is_completed", false)
    .eq("due_date", tomorrowISO);

  if (error) { console.error("[cron] tax-reminder query error", error.message); return; }
  console.log(`[cron] ${data?.length ?? 0} tax reminders due tomorrow`);
}

async function markOverdueInvoices() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from("invoices")
    .update({ status: "overdue" })
    .eq("status", "sent")
    .lt("due_date", todayISO);
  if (error) console.error("[cron] overdue-invoice update error", error.message);
  else console.log("[cron] overdue invoices updated");
}

async function processRecurringTransactions() {
  const today = new Date();
  if (today.getDate() !== 1) return;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("is_recurring", true);

  if (error) { console.error("[cron] recurring-tx query error", error.message); return; }
  if (!data?.length) return;

  const copies = data.map(({ id: _id, created_at: _ca, ...rest }) => ({
    ...rest,
    date: today.toISOString().slice(0, 10),
  }));

  const { error: insertErr } = await supabase.from("transactions").insert(copies);
  if (insertErr) console.error("[cron] recurring-tx insert error", insertErr.message);
  else console.log(`[cron] created ${copies.length} recurring transactions`);
}

async function renewRecurringTaxReminders() {
  const today = new Date();
  if (today.getDate() !== 1) return;

  const { data, error } = await supabase
    .from("tax_reminders")
    .select("*")
    .eq("is_recurring", true)
    .eq("is_completed", true);

  if (error) { console.error("[cron] tax-reminder renew query error", error.message); return; }
  if (!data?.length) return;

  const { error: updateErr } = await supabase
    .from("tax_reminders")
    .update({ is_completed: false })
    .in("id", data.map((r) => r.id));

  if (updateErr) console.error("[cron] tax-reminder renew error", updateErr.message);
  else console.log(`[cron] renewed ${data.length} recurring tax reminders`);
}

// 06:00 UTC — sync exchange rates daily
cron.schedule("0 6 * * *", () => { syncExchangeRates().catch(console.error); });

// 08:00 UTC — notify about tax reminders due tomorrow
cron.schedule("0 8 * * *", () => { sendTaxReminders().catch(console.error); });

// 09:00 UTC — mark overdue invoices
cron.schedule("0 9 * * *", () => { markOverdueInvoices().catch(console.error); });

// 00:05 UTC on 1st of month — recurring transactions
cron.schedule("5 0 1 * *", () => { processRecurringTransactions().catch(console.error); });

// 00:10 UTC on 1st of month — reset completed recurring tax reminders
cron.schedule("10 0 1 * *", () => { renewRecurringTaxReminders().catch(console.error); });

console.log("[cron] scheduler started");

// Run exchange rate sync immediately on boot
syncExchangeRates().catch(console.error);
