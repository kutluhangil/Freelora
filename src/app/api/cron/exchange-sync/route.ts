import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key" }, { status: 500 });
  }

  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
  if (!res.ok) {
    return NextResponse.json({ error: "Exchange rate fetch failed" }, { status: 502 });
  }

  const data = await res.json();
  if (data.result !== "success") {
    return NextResponse.json({ error: data["error-type"] }, { status: 502 });
  }

  const fetchedAt = new Date().toISOString();
  const rates = Object.entries(data.conversion_rates as Record<string, number>)
    .filter(([code]) => code !== "USD")
    .map(([target_currency, rate]) => ({
      base_currency: "USD",
      target_currency,
      rate,
      fetched_at: fetchedAt,
    }));

  const admin = createAdminClient();
  const { error } = await admin
    .from("exchange_rates")
    .upsert(rates, { onConflict: "base_currency,target_currency" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ synced: rates.length, at: fetchedAt });
}
