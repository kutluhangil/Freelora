import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TransactionList } from "@/components/transactions/TransactionList";
import { AddTransactionButton } from "@/components/transactions/AddTransactionButton";

export default async function IncomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const [tx, projects, clients] = await Promise.all([
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", "income")
      .order("date", { ascending: false }),
    supabase.from("projects").select("id,name").eq("user_id", user.id).order("name"),
    supabase.from("clients").select("id,name").eq("user_id", user.id).order("name"),
  ]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">{t("nav.income")}</h1>
          <p className="mt-1 text-xs text-text-tertiary">{tx.data?.length ?? 0} {t("common.actions").toLowerCase()}</p>
        </div>
        <AddTransactionButton type="income" projects={projects.data ?? []} clients={clients.data ?? []} />
      </div>

      <div className="rounded-lg border border-border-subtle bg-bg-secondary">
        <TransactionList
          transactions={(tx.data ?? []) as never}
          projects={projects.data ?? []}
          clients={clients.data ?? []}
          defaultType="income"
        />
      </div>
    </div>
  );
}
