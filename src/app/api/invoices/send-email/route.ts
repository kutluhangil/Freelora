import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { invoiceEmailHtml } from "@/lib/email/templates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { invoiceId, locale } = await request.json() as { invoiceId: string; locale: string };

  const admin = createAdminClient();

  const { data: invoice } = await admin
    .from("invoices")
    .select("*, clients(name, email)")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const client = invoice.clients as { name: string; email: string | null } | null;
  if (!client?.email) {
    return NextResponse.json({ error: "Client has no email address" }, { status: 400 });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, company_name")
    .eq("id", user.id)
    .maybeSingle();

  const fromName = profile?.company_name ?? profile?.full_name ?? "Freelora";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://freelora.app";
  const pdfUrl = `${appUrl}/api/invoices/generate-pdf?id=${invoiceId}&locale=${locale}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: client.email,
    subject: locale === "tr"
      ? `${fromName} — ${invoice.invoice_number} numaralı fatura`
      : `Invoice ${invoice.invoice_number} from ${fromName}`,
    html: invoiceEmailHtml({
      fromName,
      clientName: client.name,
      invoiceNumber: invoice.invoice_number,
      total: invoice.total,
      currency: invoice.currency,
      dueDate: invoice.due_date,
      notes: invoice.notes,
      locale: (locale as "tr" | "en") ?? "tr",
    }),
    attachments: [
      {
        filename: `${invoice.invoice_number}.pdf`,
        path: pdfUrl,
      },
    ],
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Mark as sent
  await admin
    .from("invoices")
    .update({ status: "sent", sent_at: new Date().toISOString() } as never)
    .eq("id", invoiceId);

  return NextResponse.json({ ok: true });
}
