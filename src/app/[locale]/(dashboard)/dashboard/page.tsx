import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Plus,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/queries/dashboard";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ProjectProfitChart } from "@/components/dashboard/ProjectProfitChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { UpcomingTaxes } from "@/components/dashboard/UpcomingTaxes";
import { CurrencyWidget } from "@/components/dashboard/CurrencyWidget";
import { TaxReserveWidget } from "@/components/dashboard/TaxReserveWidget";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { currencySymbol } from "@/lib/utils/currency";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,preferred_currency")
    .eq("id", user.id)
    .maybeSingle();

  const data = await getDashboardData(user.id);
  const sym = currencySymbol(profile?.preferred_currency ?? "TRY");

  const yearStart = `${new Date().getFullYear()}-01-01`;
  const { data: ytdRows } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", user.id)
    .eq("type", "income")
    .gte("date", yearStart);
  const ytdIncome = (ytdRows ?? []).reduce((s, r) => s + Number(r.amount), 0);

  const incomeDelta =
    data.prevMonthIncome > 0
      ? ((data.monthIncome - data.prevMonthIncome) / data.prevMonthIncome) * 100
      : 0;
  const expenseDelta =
    data.prevMonthExpense > 0
      ? ((data.monthExpense - data.prevMonthExpense) / data.prevMonthExpense) * 100
      : 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">
            {t("welcome")}
            {profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-1 text-xs text-text-tertiary">{t("title")}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/income">
            <Button variant="secondary" size="sm">
              <Plus className="h-3.5 w-3.5" />
              {t("addTransaction")}
            </Button>
          </Link>
          <Link href="/invoices/new">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              {t("createInvoice")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label={t("monthlyIncome")}
          value={data.monthIncome}
          prefix={sym}
          decimals={2}
          delta={incomeDelta}
          deltaSuffix={t("vsLastMonth")}
          tone="income"
          delay={0}
        />
        <StatCard
          icon={TrendingDown}
          label={t("monthlyExpense")}
          value={data.monthExpense}
          prefix={sym}
          decimals={2}
          delta={expenseDelta}
          deltaSuffix={t("vsLastMonth")}
          tone="expense"
          delay={0.08}
        />
        <StatCard
          icon={Wallet}
          label={t("netProfit")}
          value={data.netProfit}
          prefix={sym}
          decimals={2}
          tone={data.netProfit >= 0 ? "income" : "expense"}
          delay={0.16}
        />
        <StatCard
          icon={FileText}
          label={t("pendingInvoices")}
          value={data.pendingInvoicesCount}
          decimals={0}
          delay={0.24}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("revenueOverTime")}</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={data.trend} currencySymbol={sym} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("projectProfitability")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectProfitChart data={data.topProjects} currencySymbol={sym} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("recentTransactions")}</CardTitle>
            <Link
              href="/income"
              className="text-xs text-text-tertiary hover:text-accent transition-colors"
            >
              {t("viewAll")}
            </Link>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={data.recentTransactions} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("upcomingTaxes")}</CardTitle>
              <Link
                href="/calendar"
                className="text-xs text-text-tertiary hover:text-accent transition-colors"
              >
                {tNav("calendar")}
              </Link>
            </CardHeader>
            <CardContent>
              <UpcomingTaxes reminders={data.upcomingTaxes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("exchangeRates")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-32" />}>
                <CurrencyWidget />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("taxReserve")}</CardTitle>
            </CardHeader>
            <CardContent>
              <TaxReserveWidget
                ytdIncome={ytdIncome}
                currency={profile?.preferred_currency ?? "TRY"}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
