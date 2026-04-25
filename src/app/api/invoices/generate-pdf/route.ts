import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { InvoicePDFTemplate } from "@/lib/pdf/invoice-template";
import { formatCurrency } from "@/lib/utils/currency";
import type { Client, Invoice, InvoiceItem, Profile } from "@/types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const locale = url.searchParams.get("locale") ?? "tr";
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: invoice }, { data: profile }] = await Promise.all([
    supabase.from("invoices").select("*").eq("id", id).eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
  ]);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [{ data: items }, { data: client }] = await Promise.all([
    supabase.from("invoice_items").select("*").eq("invoice_id", id).order("sort_order"),
    invoice.client_id
      ? supabase.from("clients").select("*").eq("id", invoice.client_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const labelsTr = {
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
  const labelsEn = {
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
  };
  const labels = locale === "en" ? labelsEn : labelsTr;
  const lc = locale === "en" ? "en-US" : "tr-TR";
  const fmt = (n: number) => formatCurrency(n, (invoice as Invoice).currency, lc);

  const stream = await renderToStream(
    InvoicePDFTemplate({
      invoice: invoice as Invoice,
      items: (items ?? []) as InvoiceItem[],
      client: (client ?? null) as Client | null,
      profile: (profile ?? null) as Profile | null,
      labels,
      fmt,
    })
  );

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${(invoice as Invoice).invoice_number}.pdf"`,
    },
  });
}
