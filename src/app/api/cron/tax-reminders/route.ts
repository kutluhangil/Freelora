import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date();

  let notified = 0;

  for (const days of [7, 3, 1]) {
    const target = new Date(today);
    target.setDate(target.getDate() + days);
    const dateStr = target.toISOString().slice(0, 10);

    const { data: reminders } = await admin
      .from("tax_reminders")
      .select("id, user_id, title, due_date")
      .eq("due_date", dateStr)
      .eq("is_completed", false)
      .eq("notified", false);

    if (!reminders?.length) continue;

    // Mark as notified (email sending would be added here with Resend/SendGrid)
    await admin
      .from("tax_reminders")
      .update({ notified: true } as never)
      .in("id", reminders.map((r) => r.id));

    notified += reminders.length;
  }

  return NextResponse.json({ notified });
}
