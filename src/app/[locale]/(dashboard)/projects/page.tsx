import { redirect } from "next/navigation";
import { Briefcase } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsHeader } from "@/components/projects/ProjectsHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Project, Transaction } from "@/types/database";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const [projects, clients, allTx] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("clients").select("id,name").eq("user_id", user.id).order("name"),
    supabase
      .from("transactions")
      .select("project_id,type,amount,amount_in_base")
      .eq("user_id", user.id),
  ]);

  // Aggregate per project
  const profitMap = new Map<string, number>();
  const usedMap = new Map<string, number>();
  for (const tx of (allTx.data ?? []) as Pick<Transaction, "project_id" | "type" | "amount" | "amount_in_base">[]) {
    if (!tx.project_id) continue;
    const v = Number(tx.amount_in_base ?? tx.amount ?? 0);
    profitMap.set(tx.project_id, (profitMap.get(tx.project_id) ?? 0) + (tx.type === "income" ? v : -v));
    if (tx.type === "expense") usedMap.set(tx.project_id, (usedMap.get(tx.project_id) ?? 0) + v);
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">{t("project.title")}</h1>
          <p className="mt-1 text-xs text-text-tertiary">
            {projects.data?.length ?? 0} {t("project.active").toLowerCase()}
          </p>
        </div>
        <ProjectsHeader clients={clients.data ?? []} />
      </div>

      {(projects.data ?? []).length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={t("project.noProjects")}
          description={t("project.noProjectsHint")}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(projects.data as Project[]).map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              netProfit={profitMap.get(p.id) ?? 0}
              budgetUsed={usedMap.get(p.id) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
