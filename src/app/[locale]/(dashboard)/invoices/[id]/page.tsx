import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { InvoiceActions } from "@/components/invoices/InvoiceActions";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import type { Client, Invoice, InvoiceItem } from "@/types/database";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!invoice) notFound();

  const [{ data: items }, { data: client }] = await Promise.all([
    supabase.from("invoice_items").select("*").eq("invoice_id", id).order("sort_order"),
    invoice.client_id
      ? supabase.from("clients").select("*").eq("id", invoice.client_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const inv = invoice as Invoice;
  const cli = client as Client | null;
  const lc = locale === "tr" ? "tr-TR" : "en-US";
  const fmt = (n: number) => formatCurrency(n, inv.currency, lc);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Link
        href="/invoices"
        className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
      >
        <ChevronLeft className="h-3 w-3" />
        {t("invoice.title")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight">{inv.invoice_number}</h1>
            <StatusBadge status={inv.status} scope="invoice" />
          </div>
          <p className="mt-1 text-xs text-text-tertiary">
            {t("invoice.issueDate")}: {formatDate(inv.issue_date, "dd MMM yyyy", locale as "tr" | "en")} ·{" "}
            {t("invoice.dueDate")}: {formatDate(inv.due_date, "dd MMM yyyy", locale as "tr" | "en")}
          </p>
        </div>
        <InvoiceActions invoice={inv} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("invoice.client")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-semibold">{cli?.name ?? "—"}</p>
            {cli?.company && <p className="text-text-secondary text-xs">{cli.company}</p>}
            {cli?.email && <p className="text-text-tertiary text-xs">{cli.email}</p>}
            {cli?.address && <p className="text-text-tertiary text-xs">{cli.address}</p>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("invoice.items")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <Thead>
                <Tr>
                  <Th>{t("invoice.description")}</Th>
                  <Th className="text-right">{t("invoice.quantity")}</Th>
                  <Th className="text-right">{t("invoice.unitPrice")}</Th>
                  <Th className="text-right">{t("invoice.total")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(items as InvoiceItem[]).map((it) => (
                  <Tr key={it.id}>
                    <Td>{it.description}</Td>
                    <Td className="text-right font-mono" data-tabular>
                      {Number(it.quantity)}
                    </Td>
                    <Td className="text-right font-mono" data-tabular>
                      {fmt(Number(it.unit_price))}
                    </Td>
                    <Td className="text-right font-mono font-semibold" data-tabular>
                      {fmt(Number(it.total))}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="ml-auto w-full max-w-sm rounded-lg border border-border-subtle bg-bg-secondary p-5">
        <Row label={t("invoice.subtotal")} value={fmt(Number(inv.subtotal))} />
        {Number(inv.discount_amount) > 0 && (
          <Row label={`${t("invoice.discount")} (${Number(inv.discount_rate)}%)`} value={`-${fmt(Number(inv.discount_amount))}`} />
        )}
        {Number(inv.tax_amount) > 0 && (
          <Row label={`${t("invoice.tax")} (${Number(inv.tax_rate)}%)`} value={fmt(Number(inv.tax_amount))} />
        )}
        <div className="my-3 border-t border-border-subtle" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary">{t("invoice.grandTotal")}</span>
          <span className="font-mono text-xl font-bold text-accent" data-tabular>
            {fmt(Number(inv.total))}
          </span>
        </div>
      </div>

      {(inv.notes || inv.payment_terms) && (
        <Card>
          <CardContent className="space-y-3 p-5 text-sm text-text-secondary">
            {inv.payment_terms && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-text-tertiary">
                  {t("invoice.paymentTerms")}
                </p>
                <p className="mt-1">{inv.payment_terms}</p>
              </div>
            )}
            {inv.notes && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-text-tertiary">
                  {t("invoice.notes")}
                </p>
                <p className="mt-1">{inv.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-text-tertiary">{label}</span>
      <span className="font-mono text-sm" data-tabular>
        {value}
      </span>
    </div>
  );
}
