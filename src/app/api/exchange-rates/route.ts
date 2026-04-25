import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("exchange_rates")
    .select("target_currency, rate, fetched_at")
    .eq("base_currency", "USD")
    .order("target_currency");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rates: data ?? [] });
}
