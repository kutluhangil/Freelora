import { createClient } from "@/lib/supabase/server";
import type { Transaction, Invoice, TaxReminder } from "@/types/database";

export interface DashboardData {
  monthIncome: number;
  monthExpense: number;
  netProfit: number;
  pendingInvoicesCount: number;
  prevMonthIncome: number;
  prevMonthExpense: number;
  recentTransactions: Transaction[];
  upcomingTaxes: TaxReminder[];
  trend: { month_label: string; income: number; expense: number }[];
  topProjects: { id: string; name: string; color: string; net_profit: number }[];
}

function range(year: number, month: number) {
  // month is 1-indexed
  const start = new Date(Date.UTC(year, month - 1, 1)).toISOString().split("T")[0];
  const end = new Date(Date.UTC(year, month, 0)).toISOString().split("T")[0];
  return { start, end };
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient();
  const now = new Date();
  const cur = range(now.getFullYear(), now.getMonth() + 1);
  const prev = range(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(), now.getMonth() === 0 ? 12 : now.getMonth());

  const [curTx, prevTx, recent, invoices, taxes, trend, projects] = await Promise.all([
    supabase
      .from("transactions")
      .select("type,amount,amount_in_base")
      .eq("user_id", userId)
      .gte("date", cur.start)
      .lte("date", cur.end),
    supabase
      .from("transactions")
      .select("type,amount,amount_in_base")
      .eq("user_id", userId)
      .gte("date", prev.start)
      .lte("date", prev.end),
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(8),
    supabase
      .from("invoices")
      .select("id")
      .eq("user_id", userId)
      .in("status", ["sent", "overdue"]),
    supabase
      .from("tax_reminders")
      .select("*")
      .eq("user_id", userId)
      .eq("is_completed", false)
      .gte("due_date", new Date().toISOString().split("T")[0])
      .order("due_date", { ascending: true })
      .limit(4),
    supabase.rpc("get_revenue_trend", { p_user_id: userId, p_months: 6 }),
    supabase.from("projects").select("id,name,color").eq("user_id", userId).eq("status", "active").limit(5),
  ]);

  const sumByType = (rows: { type: string; amount: number; amount_in_base: number | null }[] | null, t: string) =>
    (rows ?? [])
      .filter((r) => r.type === t)
      .reduce((s, r) => s + Number(r.amount_in_base ?? r.amount ?? 0), 0);

  const monthIncome = sumByType(curTx.data, "income");
  const monthExpense = sumByType(curTx.data, "expense");
  const prevMonthIncome = sumByType(prevTx.data, "income");
  const prevMonthExpense = sumByType(prevTx.data, "expense");

  // Compute top project profitability quickly via single sum per project
  const topProjects: DashboardData["topProjects"] = [];
  for (const p of projects.data ?? []) {
    const { data } = await supabase
      .from("transactions")
      .select("type,amount,amount_in_base")
      .eq("user_id", userId)
      .eq("project_id", p.id);
    const inc = (data ?? [])
      .filter((r) => r.type === "income")
      .reduce((s, r) => s + Number(r.amount_in_base ?? r.amount ?? 0), 0);
    const exp = (data ?? [])
      .filter((r) => r.type === "expense")
      .reduce((s, r) => s + Number(r.amount_in_base ?? r.amount ?? 0), 0);
    topProjects.push({ id: p.id, name: p.name, color: p.color, net_profit: inc - exp });
  }
  topProjects.sort((a, b) => b.net_profit - a.net_profit);

  return {
    monthIncome,
    monthExpense,
    netProfit: monthIncome - monthExpense,
    pendingInvoicesCount: invoices.data?.length ?? 0,
    prevMonthIncome,
    prevMonthExpense,
    recentTransactions: (recent.data ?? []) as Transaction[],
    upcomingTaxes: (taxes.data ?? []) as TaxReminder[],
    trend: (trend.data ?? []) as DashboardData["trend"],
    topProjects: topProjects.slice(0, 5),
  };
}
