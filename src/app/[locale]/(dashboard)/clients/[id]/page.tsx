import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Mail, Phone, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import type { Client, Invoice } from "@/types/database";

export default async function ClientDetailPage({
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

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!client) notFound();

  const [{ data: invoices }, { data: txs }] = await Promise.all([
    supabase
      .from("invoices")
      .select("*")
      .eq("client_id", id)
      .eq("user_id", user.id)
      .order("issue_date", { ascending: false }),
    supabase
      .from("transactions")
      .select("amount,amount_in_base,type")
      .eq("client_id", id)
      .eq("user_id", user.id)
      .eq("type", "income"),
  ]);

  const c = client as Client;
  const totalRevenue = (txs ?? []).reduce(
    (s, r) => s + Number(r.amount_in_base ?? r.amount ?? 0),
    0
  );
  const openInvoices = (invoices ?? []).filter((i) => i.status === "sent" || i.status === "overdue").length;
  const lc = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
      >
        <ChevronLeft className="h-3 w-3" />
        {t("client.title")}
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-muted text-base font-bold uppercase text-accent">
          {c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{c.name}</h1>
          {c.company && <p className="text-sm text-text-secondary">{c.company}</p>}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("client.totalRevenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-bold tracking-tight text-success" data-tabular>
              {formatCurrency(totalRevenue, c.currency, lc)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("client.openInvoices")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-bold tracking-tight" data-tabular>
              {openInvoices}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.preferences")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {c.email && (
              <p className="flex items-center gap-1.5 text-text-secondary">
                <Mail className="h-3 w-3" /> {c.email}
              </p>
            )}
            {c.phone && (
              <p className="flex items-center gap-1.5 text-text-secondary">
                <Phone className="h-3 w-3" /> {c.phone}
              </p>
            )}
            {(c.address || c.city) && (
              <p className="flex items-start gap-1.5 text-text-secondary">
                <MapPin className="h-3 w-3 mt-0.5" />
                <span>
                  {c.address ? `${c.address}, ` : ""}
                  {c.city ? `${c.city}, ` : ""}
                  {c.country}
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("invoice.title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {(invoices ?? []).length === 0 ? (
            <p className="px-5 py-8 text-center text-xs text-text-tertiary">{t("invoice.noInvoices")}</p>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>{t("invoice.invoiceNumber")}</Th>
                  <Th>{t("common.status")}</Th>
                  <Th>{t("invoice.issueDate")}</Th>
                  <Th>{t("invoice.dueDate")}</Th>
                  <Th className="text-right">{t("invoice.grandTotal")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(invoices as Invoice[]).map((inv) => (
                  <Tr key={inv.id}>
                    <Td className="font-mono text-xs">{inv.invoice_number}</Td>
                    <Td>
                      <StatusBadge status={inv.status} scope="invoice" />
                    </Td>
                    <Td className="text-xs text-text-tertiary">
                      {formatDate(inv.issue_date, "dd MMM yyyy", locale as "tr" | "en")}
                    </Td>
                    <Td className="text-xs text-text-tertiary">
                      {formatDate(inv.due_date, "dd MMM yyyy", locale as "tr" | "en")}
                    </Td>
                    <Td className="text-right font-mono text-sm font-medium" data-tabular>
                      {formatCurrency(Number(inv.total), inv.currency, lc)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
