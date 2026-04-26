"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils/currency";
import { deleteTimeEntry, toggleBilled } from "@/lib/actions/time-entries";
import type { TimeEntry, Project } from "@/types/database";

interface EntryWithProject extends TimeEntry {
  projects: Pick<Project, "name" | "color"> | null;
}

interface Props {
  entries: EntryWithProject[];
}

function formatDuration(minutes: number | null) {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}s ${m}dk` : `${m}dk`;
}

export function TimeEntriesList({ entries }: Props) {
  const t = useTranslations();
  const [, start] = useTransition();

  function handleDelete(id: string) {
    start(async () => {
      try {
        await deleteTimeEntry(id);
        toast.success(t("timeTracker.deleted"));
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function handleToggleBilled(id: string, current: boolean) {
    start(async () => {
      try {
        await toggleBilled(id, !current);
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle py-12 text-center">
        <p className="text-sm text-text-secondary">{t("timeTracker.noEntries")}</p>
        <p className="mt-1 text-xs text-text-tertiary">{t("timeTracker.noEntriesHint")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const earnings =
          entry.duration_minutes && entry.hourly_rate
            ? (entry.duration_minutes / 60) * entry.hourly_rate
            : null;

        return (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-secondary px-4 py-3"
          >
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {entry.description || <span className="text-text-tertiary">—</span>}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-text-tertiary">
                {entry.projects && (
                  <span
                    className="flex items-center gap-1"
                    style={{ color: entry.projects.color }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: entry.projects.color }}
                    />
                    {entry.projects.name}
                  </span>
                )}
                <span>{new Date(entry.start_time).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-medium tabular-nums">{formatDuration(entry.duration_minutes)}</p>
              {earnings !== null && (
                <p className="text-xs text-accent">
                  {formatCurrency(earnings, entry.currency)}
                </p>
              )}
            </div>

            <button
              onClick={() => handleToggleBilled(entry.id, entry.is_billed)}
              title={entry.is_billed ? t("timeTracker.billed") : t("timeTracker.notBilled")}
              className="shrink-0 text-text-tertiary hover:text-accent transition-colors"
            >
              {entry.is_billed
                ? <CheckCircle2 className="h-4 w-4 text-accent" />
                : <Circle className="h-4 w-4" />
              }
            </button>

            <button
              onClick={() => handleDelete(entry.id)}
              className="shrink-0 text-text-tertiary hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
