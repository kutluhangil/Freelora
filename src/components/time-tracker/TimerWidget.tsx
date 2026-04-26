"use client";

import { useState, useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Play, Square, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CURRENCIES } from "@/lib/constants/currencies";
import { startTimer, stopTimer } from "@/lib/actions/time-entries";
import type { TimeEntry, Project, Client } from "@/types/database";

interface Props {
  activeEntry: TimeEntry | null;
  projects: Pick<Project, "id" | "name">[];
  clients: Pick<Client, "id" | "name">[];
}

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function TimerWidget({ activeEntry, projects, clients }: Props) {
  const t = useTranslations();
  const [pending, start] = useTransition();
  const [elapsed, setElapsed] = useState(0);
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [clientId, setClientId] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [currency, setCurrency] = useState("TRY");

  useEffect(() => {
    if (!activeEntry) { setElapsed(0); return; }
    const startMs = new Date(activeEntry.start_time).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - startMs) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeEntry]);

  function handleStart() {
    start(async () => {
      try {
        await startTimer({
          description: description || undefined,
          project_id: projectId || null,
          client_id: clientId || null,
          hourly_rate: hourlyRate ? Number(hourlyRate) : null,
          currency,
        });
        setDescription("");
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function handleStop() {
    if (!activeEntry) return;
    start(async () => {
      try {
        await stopTimer(activeEntry.id);
        toast.success(t("timeTracker.entrySaved"));
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-accent" />
        <h2 className="font-display font-bold text-sm">{t("timeTracker.timer")}</h2>
        {activeEntry && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-accent">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            {t("timeTracker.running")}
          </span>
        )}
      </div>

      {activeEntry ? (
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="font-mono text-4xl font-bold tracking-widest text-text-primary">
              {formatElapsed(elapsed)}
            </p>
            {activeEntry.description && (
              <p className="mt-2 text-sm text-text-secondary">{activeEntry.description}</p>
            )}
          </div>
          <Button
            variant="destructive"
            className="w-full gap-2"
            loading={pending}
            onClick={handleStop}
          >
            <Square className="h-4 w-4" />
            {t("timeTracker.stop")}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Input
            placeholder={t("timeTracker.whatWorking")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              options={[
                { value: "", label: t("transaction.noProject") },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
            <Select
              options={[
                { value: "", label: t("transaction.noClient") },
                ...clients.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <Select
            options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.flag ?? ""} ${c.code}` }))}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
          <Input
            label={t("timeTracker.hourlyRate")}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
          <Button className="w-full gap-2" loading={pending} onClick={handleStart}>
            <Play className="h-4 w-4" />
            {t("timeTracker.start")}
          </Button>
        </div>
      )}
    </div>
  );
}
