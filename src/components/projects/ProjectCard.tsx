"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils/currency";
import type { Project } from "@/types/database";

interface Props {
  project: Project;
  netProfit?: number;
  budgetUsed?: number;
}

export function ProjectCard({ project, netProfit = 0, budgetUsed = 0 }: Props) {
  const t = useTranslations("project");
  const locale = useLocale() as "tr" | "en";
  const usagePct =
    project.budget_amount && project.budget_amount > 0
      ? Math.min(100, (budgetUsed / Number(project.budget_amount)) * 100)
      : 0;
  const barColor = usagePct > 85 ? "bg-danger" : usagePct > 60 ? "bg-warning" : "bg-success";

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full p-5 transition-all hover:border-accent/40 hover:shadow-glow">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h3 className="truncate text-sm font-semibold text-text-primary">{project.name}</h3>
          </div>
          <StatusBadge status={project.status} scope="project" />
        </div>
        {project.description && (
          <p className="mt-2 line-clamp-2 text-xs text-text-tertiary">{project.description}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-text-tertiary">{t("netProfit")}</p>
            <p
              className={`mt-0.5 font-mono text-sm font-semibold ${
                netProfit >= 0 ? "text-success" : "text-danger"
              }`}
              data-tabular
            >
              {formatCurrency(netProfit, project.budget_currency, locale === "tr" ? "tr-TR" : "en-US")}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary">{t("budget")}</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-text-primary" data-tabular>
              {project.budget_amount
                ? formatCurrency(
                    Number(project.budget_amount),
                    project.budget_currency,
                    locale === "tr" ? "tr-TR" : "en-US"
                  )
                : "—"}
            </p>
          </div>
        </div>

        {project.budget_amount ? (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-text-tertiary">
              <span>{t("budgetUsage")}</span>
              <span data-tabular>{usagePct.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
              <div
                className={`h-full ${barColor} transition-all`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        ) : null}

        {project.tags && project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
