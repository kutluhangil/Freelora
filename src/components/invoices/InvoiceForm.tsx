"use client";

import { useState, useTransition, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CURRENCIES } from "@/lib/constants/currencies";
import { todayISO } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/currency";
import { createInvoice } from "@/lib/actions/invoices";
import type { Client, Project } from "@/types/database";

interface Item {
  description: string;
  quantity: number;
  unit_price: number;
}

interface Props {
  clients: Pick<Client, "id" | "name" | "currency">[];
  projects: Pick<Project, "id" | "name" | "client_id">[];
}

export function InvoiceForm({ clients, projects }: Props) {
  const t = useTranslations();
  const locale = useLocale() as "tr" | "en";
  const router = useRouter();
  const [pending, start] = useTransition();
  const [client_id, setClientId] = useState(clients[0]?.id ?? "");
  const [project_id, setProjectId] = useState("");
  const [issue_date, setIssue] = useState(todayISO());
  const [due_date, setDue] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [currency, setCurrency] = useState(clients[0]?.currency ?? "TRY");
  const [tax_rate, setTaxRate] = useState(20);
  const [discount_rate, setDiscountRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [payment_terms, setTerms] = useState("");
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: 1, unit_price: 0 }]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.unit_price || 0), 0);
    const discountAmount = subtotal * (Number(discount_rate) / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (Number(tax_rate) / 100);
    const total = afterDiscount + taxAmount;
    return { subtotal, discountAmount, taxAmount, total };
  }, [items, tax_rate, discount_rate]);

  const filteredProjects = projects.filter((p) => !client_id || p.client_id === client_id || !p.client_id);

  function updateItem(idx: number, patch: Partial<Item>) {
    setItems((s) => s.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function addItem() {
    setItems((s) => [...s, { description: "", quantity: 1, unit_price: 0 }]);
  }
  function removeItem(idx: number) {
    setItems((s) => (s.length === 1 ? s : s.filter((_, i) => i !== idx)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!client_id) {
      toast.error(t("invoice.selectClient"));
      return;
    }
    start(async () => {
      try {
        const inv = await createInvoice({
          client_id,
          project_id: project_id || null,
          issue_date,
          due_date,
          currency,
          tax_rate: Number(tax_rate),
          discount_rate: Number(discount_rate),
          notes,
          payment_terms,
          items: items.map((i) => ({
            description: i.description,
            quantity: Number(i.quantity),
            unit_price: Number(i.unit_price),
          })),
        } as never);
        toast.success(t("common.save"));
        router.push(`/invoices/${(inv as { id: string }).id}`);
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  const lc = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Select
          label={t("invoice.client")}
          options={clients.map((c) => ({ value: c.id, label: c.name }))}
          value={client_id}
          onChange={(e) => {
            setClientId(e.target.value);
            const c = clients.find((c) => c.id === e.target.value);
            if (c?.currency) setCurrency(c.currency);
          }}
          placeholder={t("invoice.selectClient")}
        />
        <Select
          label={t("invoice.project")}
          options={[{ value: "", label: "—" }, ...filteredProjects.map((p) => ({ value: p.id, label: p.name }))]}
          value={project_id}
          onChange={(e) => setProjectId(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label={t("invoice.issueDate")} type="date" value={issue_date} onChange={(e) => setIssue(e.target.value)} required />
        <Input label={t("invoice.dueDate")} type="date" value={due_date} onChange={(e) => setDue(e.target.value)} required />
        <Select
          label={t("transaction.currency")}
          options={CURRENCIES.slice(0, 8).map((c) => ({ value: c.code, label: c.code }))}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
      </div>

      {/* Items */}
      <div className="rounded-lg border border-border-subtle bg-bg-secondary">
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h3 className="text-sm font-semibold">{t("invoice.items")}</h3>
          <Button type="button" variant="secondary" size="sm" onClick={addItem}>
            <Plus className="h-3 w-3" />
            {t("invoice.addItem")}
          </Button>
        </div>
        <div className="divide-y divide-border-subtle">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 px-4 py-3">
              <div className="col-span-12 md:col-span-6">
                <input
                  placeholder={t("invoice.description")}
                  className="h-9 w-full rounded-md border border-border-subtle bg-bg-tertiary px-3 text-sm focus:border-accent focus:outline-none"
                  value={it.description}
                  onChange={(e) => updateItem(idx, { description: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder={t("invoice.quantity")}
                  className="h-9 w-full rounded-md border border-border-subtle bg-bg-tertiary px-3 text-right font-mono text-sm focus:border-accent focus:outline-none"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                  data-tabular
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder={t("invoice.unitPrice")}
                  className="h-9 w-full rounded-md border border-border-subtle bg-bg-tertiary px-3 text-right font-mono text-sm focus:border-accent focus:outline-none"
                  value={it.unit_price}
                  onChange={(e) => updateItem(idx, { unit_price: Number(e.target.value) })}
                  data-tabular
                />
              </div>
              <div className="col-span-3 md:col-span-1 flex items-center justify-end font-mono text-sm" data-tabular>
                {formatCurrency(Number(it.quantity || 0) * Number(it.unit_price || 0), currency, lc)}
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="rounded p-1.5 text-text-tertiary hover:bg-danger-muted hover:text-danger transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals + meta */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label={t("invoice.taxRate") + " (%)"}
              type="number"
              step="0.01"
              value={tax_rate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
            />
            <Input
              label={t("invoice.discountRate") + " (%)"}
              type="number"
              step="0.01"
              value={discount_rate}
              onChange={(e) => setDiscountRate(Number(e.target.value))}
            />
          </div>
          <Textarea
            label={t("invoice.paymentTerms")}
            rows={2}
            value={payment_terms}
            onChange={(e) => setTerms(e.target.value)}
          />
          <Textarea
            label={t("invoice.notes")}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="rounded-lg border border-border-subtle bg-bg-secondary p-5">
          <div className="space-y-3">
            <Row label={t("invoice.subtotal")} value={formatCurrency(totals.subtotal, currency, lc)} />
            <Row
              label={`${t("invoice.discount")} (${discount_rate}%)`}
              value={`-${formatCurrency(totals.discountAmount, currency, lc)}`}
              muted
            />
            <Row
              label={`${t("invoice.tax")} (${tax_rate}%)`}
              value={formatCurrency(totals.taxAmount, currency, lc)}
              muted
            />
            <div className="my-3 border-t border-border-subtle" />
            <Row
              label={t("invoice.grandTotal")}
              value={formatCurrency(totals.total, currency, lc)}
              big
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={pending} size="lg">
              {t("invoice.save")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Row({ label, value, muted, big }: { label: string; value: string; muted?: boolean; big?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-xs ${muted ? "text-text-tertiary" : "text-text-secondary"}`}>{label}</span>
      <span
        className={`font-mono ${big ? "text-lg font-bold text-accent" : "text-sm text-text-primary"}`}
        data-tabular
      >
        {value}
      </span>
    </div>
  );
}
