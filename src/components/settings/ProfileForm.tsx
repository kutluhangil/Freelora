"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CURRENCIES } from "@/lib/constants/currencies";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export function ProfileForm({ profile }: { profile: Profile }) {
  const t = useTranslations();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    full_name: profile.full_name ?? "",
    company_name: profile.company_name ?? "",
    tax_id: profile.tax_id ?? "",
    phone: profile.phone ?? "",
    address: profile.address ?? "",
    city: profile.city ?? "",
    country: profile.country ?? "TR",
    preferred_currency: profile.preferred_currency ?? "TRY",
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").update(form).eq("id", profile.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(t("settings.saved"));
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("auth.fullName")}
          value={form.full_name}
          onChange={(e) => set("full_name", e.target.value)}
        />
        <Input
          label={t("settings.phone")}
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("settings.companyName")}
          value={form.company_name}
          onChange={(e) => set("company_name", e.target.value)}
        />
        <Input
          label={t("settings.taxId")}
          value={form.tax_id}
          onChange={(e) => set("tax_id", e.target.value)}
        />
      </div>
      <Textarea
        label={t("settings.address")}
        value={form.address}
        onChange={(e) => set("address", e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label={t("client.city")}
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
        />
        <Input
          label={t("client.country")}
          value={form.country}
          onChange={(e) => set("country", e.target.value)}
        />
        <Select
          label={t("settings.preferredCurrency")}
          options={CURRENCIES.map((c) => ({ value: c.code, label: c.code }))}
          value={form.preferred_currency}
          onChange={(e) => set("preferred_currency", e.target.value)}
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={pending}>
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
}
