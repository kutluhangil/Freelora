import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { taxReminderHtml } from "@/lib/email/templates";

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

    for (const reminder of reminders) {
      const { data: profile } = await admin
        .from("profiles")
        .select("email, full_name, locale")
        .eq("id", reminder.user_id)
        .maybeSingle();

      if (!profile?.email) continue;

      const locale = (profile.locale as "tr" | "en") ?? "tr";

      await resend.emails.send({
        from: FROM_EMAIL,
        to: profile.email,
        subject: locale === "tr"
          ? `Vergi hatırlatması: ${reminder.title} — ${days} gün kaldı`
          : `Tax reminder: ${reminder.title} — ${days} days left`,
        html: taxReminderHtml({
          name: profile.full_name ?? profile.email,
          title: reminder.title,
          dueDate: reminder.due_date,
          daysLeft: days,
          locale,
        }),
      });

      await admin
        .from("tax_reminders")
        .update({ notified: true } as never)
        .eq("id", reminder.id);

      notified++;
    }
  }

  return NextResponse.json({ notified });
}
