import { redirect } from "next/navigation";
import { Plus, Receipt } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import type { Invoice, Client } from "@/types/database";

export default async function InvoicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const [{ data: invoices }, { data: clients }] = await Promise.all([
    supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("issue_date", { ascending: false }),
    supabase.from("clients").select("id,name").eq("user_id", user.id),
  ]);

  const clientMap = new Map<string, string>();
  for (const c of (clients ?? []) as Pick<Client, "id" | "name">[]) clientMap.set(c.id, c.name);
  const lc = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">{t("invoice.title")}</h1>
          <p className="mt-1 text-xs text-text-tertiary">{invoices?.length ?? 0}</p>
        </div>
        <Link href="/invoices/new">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            {t("invoice.newInvoice")}
          </Button>
        </Link>
      </div>

      {(invoices ?? []).length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={t("invoice.noInvoices")}
          description={t("invoice.noInvoicesHint")}
          action={
            <Link href="/invoices/new">
              <Button>{t("invoice.newInvoice")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-lg border border-border-subtle bg-bg-secondary">
          <Table>
            <Thead>
              <Tr>
                <Th>{t("invoice.invoiceNumber")}</Th>
                <Th>{t("invoice.client")}</Th>
                <Th>{t("common.status")}</Th>
                <Th>{t("invoice.issueDate")}</Th>
                <Th>{t("invoice.dueDate")}</Th>
                <Th className="text-right">{t("invoice.grandTotal")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {(invoices as Invoice[]).map((inv) => (
                <Tr key={inv.id} className="cursor-pointer">
                  <Td>
                    <Link href={`/invoices/${inv.id}`} className="font-mono text-xs text-accent hover:underline">
                      {inv.invoice_number}
                    </Link>
                  </Td>
                  <Td className="text-sm">{inv.client_id ? clientMap.get(inv.client_id) ?? "—" : "—"}</Td>
                  <Td>
                    <StatusBadge status={inv.status} scope="invoice" />
                  </Td>
                  <Td className="text-xs text-text-tertiary">
                    {formatDate(inv.issue_date, "dd MMM yyyy", locale as "tr" | "en")}
                  </Td>
                  <Td className="text-xs text-text-tertiary">
                    {formatDate(inv.due_date, "dd MMM yyyy", locale as "tr" | "en")}
                  </Td>
                  <Td className="text-right font-mono text-sm font-semibold" data-tabular>
                    {formatCurrency(Number(inv.total), inv.currency, lc)}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
