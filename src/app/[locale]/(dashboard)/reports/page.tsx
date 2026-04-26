import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { RevenueReport } from "@/components/reports/RevenueReport";
import { CategoryBreakdown } from "@/components/reports/CategoryBreakdown";
import { ExportCSVButton } from "@/components/transactions/ExportCSVButton";
import type { Profile } from "@/types/database";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_currency")
    .eq("id", user.id)
    .maybeSingle();

  const currency = (profile as Pick<Profile, "preferred_currency"> | null)?.preferred_currency ?? "TRY";
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "₺";

  const thisYear = new Date().getFullYear();
  const startOfYear = `${thisYear}-01-01`;

  // Fetch 12 months trend
  const { data: trend } = await supabase.rpc("get_revenue_trend", {
    p_user_id: user.id,
    p_months: 12,
  });

  // This year's transactions for category breakdown and summary
  const { data: txThisYear } = await supabase
    .from("transactions")
    .select("type, category, amount_in_base, amount, currency, date")
    .eq("user_id", user.id)
    .gte("date", startOfYear);

  // Summary stats
  const txList = txThisYear ?? [];
  const totalIncome = txList
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + (t.amount_in_base ?? t.amount), 0);
  const totalExpense = txList
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + (t.amount_in_base ?? t.amount), 0);
  const netProfit = totalIncome - totalExpense;

  // Category breakdown for expenses
  const categoryMap: Record<string, number> = {};
  for (const tx of txList.filter((t) => t.type === "expense")) {
    categoryMap[tx.category] = (categoryMap[tx.category] ?? 0) + (tx.amount_in_base ?? tx.amount);
  }
  const categoryData = Object.entries(categoryMap)
    .map(([category, total]) => ({ category, total: Math.round(total) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // Revenue trend data for chart
  const chartData = (trend ?? []).map((row: { month: string; income: number; expense: number }) => ({
    month: row.month,
    income: Math.round(row.income),
    expense: Math.round(row.expense),
  }));

  function fmt(n: number) {
    return `${currencySymbol}${n.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold tracking-tight">{t("reports.title")}</h1>
        <ExportCSVButton type="income" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: t("reports.totalIncome"), value: fmt(totalIncome), color: "text-green-400" },
          { label: t("reports.totalExpense"), value: fmt(totalExpense), color: "text-red-400" },
          { label: t("reports.netProfit"), value: fmt(netProfit), color: netProfit >= 0 ? "text-accent" : "text-red-400" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border-subtle bg-bg-secondary p-5"
          >
            <p className="text-xs text-text-tertiary">{card.label} ({thisYear})</p>
            <p className={`mt-1.5 text-2xl font-bold tabular-nums ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl border border-border-subtle bg-bg-secondary p-5">
        <h2 className="mb-4 text-sm font-medium text-text-secondary">
          {t("reports.revenue")} — {t("reports.last12Months")}
        </h2>
        <RevenueReport data={chartData} currencySymbol={currencySymbol} />
      </div>

      {/* Category breakdown */}
      <div className="rounded-xl border border-border-subtle bg-bg-secondary p-5">
        <h2 className="mb-4 text-sm font-medium text-text-secondary">
          {t("reports.categoryBreakdown")} ({thisYear})
        </h2>
        <CategoryBreakdown data={categoryData} currencySymbol={currencySymbol} />
      </div>
    </div>
  );
}
