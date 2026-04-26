import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { overdueInvoiceHtml } from "@/lib/email/templates";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date().toISOString().split("T")[0];
  let notified = 0;

  const { data: invoices } = await admin
    .from("invoices")
    .select(`
      id, invoice_number, total, currency, due_date, user_id,
      overdue_reminder_sent_at,
      clients ( name, email ),
      profiles!invoices_user_id_fkey ( full_name, email, locale )
    `)
    .eq("status", "sent")
    .lt("due_date", today)
    .is("overdue_reminder_sent_at", null)
    .limit(100);

  for (const inv of invoices ?? []) {
    const client = (inv.clients as unknown) as { name: string; email: string | null } | null;
    const profile = (inv.profiles as unknown) as { full_name: string | null; email: string; locale: string } | null;

    if (!client?.email || !profile?.email) continue;

    const dueDate = new Date(inv.due_date);
    const daysOverdue = Math.floor((Date.now() - dueDate.getTime()) / 86400000);
    const locale = (profile.locale === "en" ? "en" : "tr") as "tr" | "en";

    const html = overdueInvoiceHtml({
      freelancerName: profile.full_name ?? profile.email,
      clientName: client.name,
      invoiceNumber: inv.invoice_number,
      total: inv.total,
      currency: inv.currency,
      dueDate: inv.due_date,
      daysOverdue,
      locale,
    });

    const subject =
      locale === "tr"
        ? `Ödeme hatırlatması: ${inv.invoice_number}`
        : `Payment reminder: ${inv.invoice_number}`;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [client.email],
      replyTo: profile.email,
      subject,
      html,
    });

    if (!error) {
      await admin
        .from("invoices")
        .update({ overdue_reminder_sent_at: new Date().toISOString(), status: "overdue" })
        .eq("id", inv.id);
      notified++;
    }
  }

  return NextResponse.json({ notified, at: new Date().toISOString() });
}
