import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { invoiceEmailHtml } from "@/lib/email/templates";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDFTemplate } from "@/lib/pdf/invoice-template";
import { formatCurrency } from "@/lib/utils/currency";
import type { Client, Invoice, InvoiceItem, Profile } from "@/types/database";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { invoiceId, locale } = (await request.json()) as {
    invoiceId: string;
    locale: string;
  };

  const admin = createAdminClient();

  const [{ data: invoice }, { data: profile }] = await Promise.all([
    admin.from("invoices").select("*").eq("id", invoiceId).eq("user_id", user.id).maybeSingle(),
    admin.from("profiles").select("*").eq("id", user.id).maybeSingle(),
  ]);

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const [{ data: items }, { data: clientData }] = await Promise.all([
    admin.from("invoice_items").select("*").eq("invoice_id", invoiceId).order("sort_order"),
    invoice.client_id
      ? admin.from("clients").select("*").eq("id", invoice.client_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const client = clientData as Client | null;
  if (!client?.email) {
    return NextResponse.json({ error: "Client has no email address" }, { status: 400 });
  }

  const fromName =
    (profile as Profile | null)?.company_name ??
    (profile as Profile | null)?.full_name ??
    "Freelora";

  const lc = locale === "en" ? "en-US" : "tr-TR";
  const fmt = (n: number) => formatCurrency(n, (invoice as Invoice).currency, lc);
  const labels =
    locale === "en"
      ? {
          invoiceTitle: "INVOICE",
          invoiceNumber: "Invoice #",
          issueDate: "Issued",
          dueDate: "Due",
          billTo: "Bill To",
          from: "From",
          description: "Description",
          qty: "Qty",
          price: "Unit",
          total: "Total",
          subtotal: "Subtotal",
          tax: "Tax",
          discount: "Discount",
          grandTotal: "Grand Total",
          paymentTerms: "Payment Terms",
          notes: "Notes",
        }
      : {
          invoiceTitle: "FATURA",
          invoiceNumber: "Fatura No",
          issueDate: "Düzenleme",
          dueDate: "Vade",
          billTo: "Fatura Adresi",
          from: "Düzenleyen",
          description: "Açıklama",
          qty: "Miktar",
          price: "Birim",
          total: "Toplam",
          subtotal: "Ara Toplam",
          tax: "KDV",
          discount: "İndirim",
          grandTotal: "Genel Toplam",
          paymentTerms: "Ödeme Koşulları",
          notes: "Notlar",
        };

  let pdfBuffer: Buffer | undefined;
  try {
    const bytes = await renderToBuffer(
      InvoicePDFTemplate({
        invoice: invoice as Invoice,
        items: (items ?? []) as InvoiceItem[],
        client,
        profile: profile as Profile | null,
        labels,
        fmt,
      })
    );
    pdfBuffer = Buffer.from(bytes);
  } catch {
    // PDF generation failed — send email without attachment
    pdfBuffer = undefined;
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: client.email,
    subject:
      locale === "tr"
        ? `${fromName} — ${(invoice as Invoice).invoice_number} numaralı fatura`
        : `Invoice ${(invoice as Invoice).invoice_number} from ${fromName}`,
    html: invoiceEmailHtml({
      fromName,
      clientName: client.name,
      invoiceNumber: (invoice as Invoice).invoice_number,
      total: (invoice as Invoice).total,
      currency: (invoice as Invoice).currency,
      dueDate: (invoice as Invoice).due_date,
      notes: (invoice as Invoice).notes,
      locale: (locale as "tr" | "en") ?? "tr",
    }),
    ...(pdfBuffer
      ? {
          attachments: [
            {
              filename: `${(invoice as Invoice).invoice_number}.pdf`,
              content: pdfBuffer,
            },
          ],
        }
      : {}),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin
    .from("invoices")
    .update({ status: "sent", sent_at: new Date().toISOString() } as never)
    .eq("id", invoiceId);

  return NextResponse.json({ ok: true });
}
