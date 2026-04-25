"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { categoriesByType } from "@/lib/constants/categories";
import { CURRENCIES } from "@/lib/constants/currencies";
import { createTransaction, updateTransaction } from "@/lib/actions/transactions";
import { todayISO } from "@/lib/utils/date";
import { ReceiptUpload } from "@/components/transactions/ReceiptUpload";
import type { Transaction, Project, Client } from "@/types/database";

interface Props {
  type: "income" | "expense";
  initial?: Transaction | null;
  projects: Pick<Project, "id" | "name">[];
  clients: Pick<Client, "id" | "name">[];
  onDone?: () => void;
  userId?: string;
}

export function TransactionForm({ type, initial, projects, clients, onDone, userId }: Props) {
  const t = useTranslations();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    type,
    category: initial?.category ?? categoriesByType(type)[0]?.id ?? "other_income",
    description: initial?.description ?? "",
    amount: initial?.amount ?? 0,
    currency: initial?.currency ?? "TRY",
    date: initial?.date ?? todayISO(),
    project_id: initial?.project_id ?? "",
    client_id: initial?.client_id ?? "",
    is_recurring: initial?.is_recurring ?? false,
    recurring_interval: initial?.recurring_interval ?? "monthly",
    notes: initial?.notes ?? "",
    receipt_url: initial?.receipt_url ?? null as string | null,
  });

  useEffect(() => {
    setForm((s) => ({ ...s, type, category: categoriesByType(type)[0]?.id ?? s.category }));
  }, [type]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      try {
        const payload = {
          ...form,
          amount: Number(form.amount),
          project_id: form.project_id || null,
          client_id: form.client_id || null,
          recurring_interval: form.is_recurring ? form.recurring_interval : null,
        };
        if (initial) await updateTransaction(initial.id, payload as never);
        else await createTransaction(payload as never);
        toast.success(t("transaction.saved"));
        onDone?.();
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  }

  const categoryOptions = categoriesByType(form.type).map((c) => ({
    value: c.id,
    label: `${c.emoji} ${t(c.labelKey)}`,
  }));

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("transaction.amount")}
          type="number"
          step="0.01"
          inputMode="decimal"
          value={form.amount as unknown as string}
          onChange={(e) => set("amount", Number(e.target.value) as never)}
          required
        />
        <Select
          label={t("transaction.currency")}
          options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.flag ?? ""} ${c.code}` }))}
          value={form.currency}
          onChange={(e) => set("currency", e.target.value)}
        />
      </div>

      <Input
        label={t("transaction.description")}
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={t("transaction.category")}
          options={categoryOptions}
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        />
        <Input
          label={t("transaction.date")}
          type="date"
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={t("transaction.project")}
          options={[
            { value: "", label: t("transaction.noProject") },
            ...projects.map((p) => ({ value: p.id, label: p.name })),
          ]}
          value={form.project_id}
          onChange={(e) => set("project_id", e.target.value)}
        />
        <Select
          label={t("transaction.client")}
          options={[
            { value: "", label: t("transaction.noClient") },
            ...clients.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={form.client_id}
          onChange={(e) => set("client_id", e.target.value)}
        />
      </div>

      <div className="rounded-md border border-border-subtle bg-bg-tertiary/40 p-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_recurring}
            onChange={(e) => set("is_recurring", e.target.checked)}
            className="h-4 w-4 rounded border-border-default bg-bg-tertiary accent-accent"
          />
          <span className="text-text-secondary">{t("transaction.recurring")}</span>
        </label>
        {form.is_recurring && (
          <div className="mt-3">
            <Select
              options={[
                { value: "monthly", label: t("transaction.monthly") },
                { value: "quarterly", label: t("transaction.quarterly") },
                { value: "yearly", label: t("transaction.yearly") },
              ]}
              value={form.recurring_interval ?? "monthly"}
              onChange={(e) => set("recurring_interval", e.target.value as never)}
            />
          </div>
        )}
      </div>

      <Textarea
        label={t("transaction.notes")}
        value={form.notes ?? ""}
        onChange={(e) => set("notes", e.target.value)}
      />

      {userId && (
        <ReceiptUpload
          value={form.receipt_url}
          onChange={(url) => set("receipt_url", url as never)}
          userId={userId}
        />
      )}

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
