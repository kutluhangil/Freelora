"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CURRENCIES } from "@/lib/constants/currencies";
import { createProject, updateProject } from "@/lib/actions/projects";
import type { Project, Client } from "@/types/database";

const COLORS = ["#C8FF00", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#FBBF24", "#F87171", "#6B7280"];

interface Props {
  initial?: Project | null;
  clients: Pick<Client, "id" | "name">[];
  onDone?: () => void;
}

export function ProjectForm({ initial, clients, onDone }: Props) {
  const t = useTranslations();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    status: initial?.status ?? "active",
    budget_amount: initial?.budget_amount ?? 0,
    budget_currency: initial?.budget_currency ?? "TRY",
    hourly_rate: initial?.hourly_rate ?? 0,
    estimated_hours: initial?.estimated_hours ?? 0,
    start_date: initial?.start_date ?? "",
    end_date: initial?.end_date ?? "",
    client_id: initial?.client_id ?? "",
    color: initial?.color ?? COLORS[0],
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      try {
        const payload = {
          ...form,
          budget_amount: Number(form.budget_amount) || null,
          hourly_rate: Number(form.hourly_rate) || null,
          estimated_hours: Number(form.estimated_hours) || null,
          client_id: form.client_id || null,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
        };
        if (initial) await updateProject(initial.id, payload as never);
        else await createProject(payload as never);
        toast.success(t("common.save"));
        onDone?.();
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label={t("project.name")}
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        required
      />
      <Textarea
        label={t("project.description")}
        value={form.description ?? ""}
        onChange={(e) => set("description", e.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={t("project.status")}
          options={[
            { value: "active", label: t("project.active") },
            { value: "paused", label: t("project.paused") },
            { value: "completed", label: t("project.completed") },
            { value: "canceled", label: t("project.canceled") },
          ]}
          value={form.status}
          onChange={(e) => set("status", e.target.value as never)}
        />
        <Select
          label={t("project.client")}
          options={[
            { value: "", label: "—" },
            ...clients.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={form.client_id}
          onChange={(e) => set("client_id", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label={t("project.budget")}
          type="number"
          value={form.budget_amount as unknown as string}
          onChange={(e) => set("budget_amount", Number(e.target.value) as never)}
        />
        <Select
          label={t("transaction.currency")}
          options={CURRENCIES.slice(0, 6).map((c) => ({ value: c.code, label: c.code }))}
          value={form.budget_currency}
          onChange={(e) => set("budget_currency", e.target.value)}
        />
        <Input
          label={t("project.hourlyRate")}
          type="number"
          value={form.hourly_rate as unknown as string}
          onChange={(e) => set("hourly_rate", Number(e.target.value) as never)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label={t("project.estimatedHours")}
          type="number"
          value={form.estimated_hours as unknown as string}
          onChange={(e) => set("estimated_hours", Number(e.target.value) as never)}
        />
        <Input
          label={t("project.startDate")}
          type="date"
          value={form.start_date ?? ""}
          onChange={(e) => set("start_date", e.target.value)}
        />
        <Input
          label={t("project.endDate")}
          type="date"
          value={form.end_date ?? ""}
          onChange={(e) => set("end_date", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          {t("project.color")}
        </label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("color", c)}
              className={`h-7 w-7 rounded-md border-2 transition-all ${
                form.color === c ? "border-text-primary scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={pending}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" loading={pending}>
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
}
