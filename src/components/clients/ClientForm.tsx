"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CURRENCIES } from "@/lib/constants/currencies";
import { createClientAction, updateClient } from "@/lib/actions/clients";
import type { Client } from "@/types/database";

interface Props {
  initial?: Client | null;
  onDone?: () => void;
}

export function ClientForm({ initial, onDone }: Props) {
  const t = useTranslations();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    company: initial?.company ?? "",
    tax_id: initial?.tax_id ?? "",
    address: initial?.address ?? "",
    city: initial?.city ?? "",
    country: initial?.country ?? "TR",
    currency: initial?.currency ?? "TRY",
    notes: initial?.notes ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      try {
        if (initial) await updateClient(initial.id, form as never);
        else await createClientAction(form as never);
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
        label={t("client.name")}
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="email"
          label={t("client.email")}
          value={form.email ?? ""}
          onChange={(e) => set("email", e.target.value)}
        />
        <Input
          label={t("client.phone")}
          value={form.phone ?? ""}
          onChange={(e) => set("phone", e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("client.company")}
          value={form.company ?? ""}
          onChange={(e) => set("company", e.target.value)}
        />
        <Input
          label={t("client.taxId")}
          value={form.tax_id ?? ""}
          onChange={(e) => set("tax_id", e.target.value)}
        />
      </div>
      <Textarea
        label={t("client.address")}
        value={form.address ?? ""}
        onChange={(e) => set("address", e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label={t("client.city")}
          value={form.city ?? ""}
          onChange={(e) => set("city", e.target.value)}
        />
        <Input
          label={t("client.country")}
          value={form.country ?? "TR"}
          onChange={(e) => set("country", e.target.value)}
        />
        <Select
          label={t("client.currency")}
          options={CURRENCIES.map((c) => ({ value: c.code, label: c.code }))}
          value={form.currency}
          onChange={(e) => set("currency", e.target.value)}
        />
      </div>
      <Textarea
        label={t("client.notes")}
        value={form.notes ?? ""}
        onChange={(e) => set("notes", e.target.value)}
      />
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
