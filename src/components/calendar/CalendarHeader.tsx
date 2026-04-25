"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { todayISO } from "@/lib/utils/date";
import {
  addCustomTaxReminder,
  seedTaxRemindersFromCountry,
} from "@/lib/actions/tax-reminders";

export function CalendarHeader() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [seeding, startSeed] = useTransition();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    title: "",
    due_date: todayISO(),
    description: "",
    is_recurring: false,
    recurring_interval: "monthly" as "monthly" | "quarterly" | "yearly",
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function onSeed() {
    startSeed(async () => {
      try {
        const n = await seedTaxRemindersFromCountry();
        toast.success(`${n}`);
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      try {
        await addCustomTaxReminder(form);
        toast.success(t("common.save"));
        setOpen(false);
        setForm({ title: "", due_date: todayISO(), description: "", is_recurring: false, recurring_interval: "monthly" });
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" loading={seeding} onClick={onSeed}>
          <RefreshCw className="h-3.5 w-3.5" />
          {t("tax.upcoming")}
        </Button>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          {t("tax.newReminder")}
        </Button>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} title={t("tax.newReminder")}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label={t("tax.reminderTitle")}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
          <Input
            type="date"
            label={t("invoice.dueDate")}
            value={form.due_date}
            onChange={(e) => set("due_date", e.target.value)}
            required
          />
          <Textarea
            label={t("transaction.notes")}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
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
                  value={form.recurring_interval}
                  onChange={(e) => set("recurring_interval", e.target.value as never)}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" loading={pending}>
              {t("common.save")}
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  );
}
