import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { findCategory } from "@/lib/constants/categories";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import type { Project, Transaction } from "@/types/database";

export default async function ProjectDetailPage({
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

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!project) notFound();

  const [{ data: txs }, { data: profitability }] = await Promise.all([
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("project_id", id)
      .order("date", { ascending: false }),
    supabase.rpc("calculate_project_profitability", { p_project_id: id }),
  ]);

  const p = project as Project;
  const transactions = (txs ?? []) as Transaction[];
  const stats = (profitability?.[0] as
    | {
        total_income: number;
        total_expense: number;
        net_profit: number;
        profit_margin: number;
        hours_logged: number;
        effective_hourly_rate: number;
      }
    | undefined) ?? {
    total_income: 0,
    total_expense: 0,
    net_profit: 0,
    profit_margin: 0,
    hours_logged: 0,
    effective_hourly_rate: 0,
  };

  const sym = p.budget_currency;
  const lc = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
      >
        <ChevronLeft className="h-3 w-3" />
        {t("project.title")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="mt-1.5 h-3 w-3 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">{p.name}</h1>
            {p.description && <p className="mt-1 max-w-xl text-sm text-text-tertiary">{p.description}</p>}
          </div>
        </div>
        <StatusBadge status={p.status} scope="project" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t("project.totalIncome")} value={formatCurrency(Number(stats.total_income), sym, lc)} tone="income" />
        <Stat label={t("project.totalExpense")} value={formatCurrency(Number(stats.total_expense), sym, lc)} tone="expense" />
        <Stat label={t("project.netProfit")} value={formatCurrency(Number(stats.net_profit), sym, lc)} tone={Number(stats.net_profit) >= 0 ? "income" : "expense"} />
        <Stat label={t("project.profitMargin")} value={`${Number(stats.profit_margin).toFixed(1)}%`} />
      </div>

      {/* Properties */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("project.profitability")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Property label={t("project.hourlyRate")} value={p.hourly_rate ? formatCurrency(Number(p.hourly_rate), sym, lc) : "—"} />
            <Property label={t("project.actualHours")} value={`${stats.hours_logged ?? 0} h`} />
            <Property label={t("project.effectiveRate")} value={formatCurrency(Number(stats.effective_hourly_rate), sym, lc)} />
            <Property label={t("project.startDate")} value={p.start_date ? formatDate(p.start_date, "dd MMM yyyy", locale as "tr" | "en") : "—"} />
            <Property label={t("project.endDate")} value={p.end_date ? formatDate(p.end_date, "dd MMM yyyy", locale as "tr" | "en") : "—"} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("nav.transactions")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-text-tertiary">
                {t("dashboard.noTransactions")}
              </p>
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>{t("transaction.description")}</Th>
                    <Th>{t("transaction.category")}</Th>
                    <Th className="text-right">{t("common.date")}</Th>
                    <Th className="text-right">{t("common.amount")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((tx) => {
                    const cat = findCategory(tx.category);
                    return (
                      <Tr key={tx.id}>
                        <Td>{tx.description}</Td>
                        <Td className="text-xs text-text-secondary">
                          {cat?.emoji} {cat ? t(cat.labelKey) : tx.category}
                        </Td>
                        <Td className="text-right text-xs text-text-tertiary">
                          {formatDate(tx.date, "dd MMM yyyy", locale as "tr" | "en")}
                        </Td>
                        <Td
                          className={`text-right font-mono text-sm font-medium ${
                            tx.type === "income" ? "text-success" : "text-danger"
                          }`}
                          data-tabular
                        >
                          {tx.type === "income" ? "+" : "−"}
                          {formatCurrency(Number(tx.amount), tx.currency, lc)}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "income" | "expense";
}) {
  const color = tone === "income" ? "text-success" : tone === "expense" ? "text-danger" : "text-text-primary";
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className={`mt-2 font-display text-2xl font-bold tracking-tight ${color}`} data-tabular>
        {value}
      </p>
    </Card>
  );
}

function Property({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-text-tertiary">{label}</span>
      <span className="font-mono text-sm text-text-primary" data-tabular>
        {value}
      </span>
    </div>
  );
}
