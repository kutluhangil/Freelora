"use client";

import { useState, useTransition, useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CURRENCIES } from "@/lib/constants/currencies";
import { formatCurrency } from "@/lib/utils/currency";
import {
  createRecurringConfig,
  updateRecurringConfig,
} from "@/lib/actions/recurring-invoices";
import type { Client, RecurringInvoiceConfig } from "@/types/database";

interface Item {
  description: string;
  quantity: number;
  unit_price: number;
}

interface Props {
  clients: Pick<Client, "id" | "name" | "currency">[];
  initial?: RecurringInvoiceConfig | null;
  onDone?: () => void;
}

export function RecurringConfigForm({ clients, initial, onDone }: Props) {
  const t = useTranslations();
  const [pending, start] = useTransition();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [clientId, setClientId] = useState(initial?.client_id ?? "");
  const [currency, setCurrency] = useState(
    initial?.currency ?? clients[0]?.currency ?? "TRY"
  );
  const [taxRate, setTaxRate] = useState(initial?.tax_rate ?? 0);
  const [discountRate, setDiscountRate] = useState(initial?.discount_rate ?? 0);
  const [interval, setInterval] = useState<"monthly" | "quarterly" | "yearly">(
    initial?.interval ?? "monthly"
  );
  const [dayOfMonth, setDayOfMonth] = useState(initial?.day_of_month ?? 1);
  const [dueDays, setDueDays] = useState(initial?.due_days ?? 14);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [paymentTerms, setPaymentTerms] = useState(initial?.payment_terms ?? "");
  const [items, setItems] = useState<Item[]>(
    initial?.items.length
      ? initial.items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unit_price: i.unit_price,
        }))
      : [{ description: "", quantity: 1, unit_price: 0 }]
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (s, i) => s + Number(i.quantity || 0) * Number(i.unit_price || 0),
      0
    );
    const discountAmount = subtotal * (Number(discountRate) / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (Number(taxRate) / 100);
    return { subtotal, discountAmount, taxAmount, total: afterDiscount + taxAmount };
  }, [items, taxRate, discountRate]);

  function updateItem(idx: number, patch: Partial<Item>) {
    setItems((s) => s.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      try {
        const payload = {
          title,
          client_id: clientId || null,
          items,
          currency,
          tax_rate: Number(taxRate),
          discount_rate: Number(discountRate),
          interval,
          day_of_month: Number(dayOfMonth),
          due_days: Number(dueDays),
          notes: notes || undefined,
          payment_terms: paymentTerms || undefined,
          is_active: true,
        };
        if (initial) {
          await updateRecurringConfig(initial.id, payload);
        } else {
          await createRecurringConfig(payload);
        }
        toast.success(t("recurringInvoice.saved"));
        onDone?.();
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  }

  const INTERVAL_OPTIONS = [
    { value: "monthly", label: t("transaction.monthly") },
    { value: "quarterly", label: t("transaction.quarterly") },
    { value: "yearly", label: t("transaction.yearly") },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Input
        label={t("recurringInvoice.templateTitle")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={t("invoice.client")}
          options={[
            { value: "", label: t("invoice.selectClient") },
            ...clients.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <Select
          label={t("transaction.currency")}
          options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.flag ?? ""} ${c.code}` }))}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
      </div>

      {/* Line items */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-text-secondary">{t("invoice.items")}</p>
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_80px_100px_36px] gap-2 items-end">
            <Input
              placeholder={t("invoice.description")}
              value={item.description}
              onChange={(e) => updateItem(idx, { description: e.target.value })}
              required
            />
            <Input
              type="number"
              min="0.01"
              step="0.01"
              placeholder={t("invoice.quantity")}
              value={item.quantity as unknown as string}
              onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
            />
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder={t("invoice.unitPrice")}
              value={item.unit_price as unknown as string}
              onChange={(e) => updateItem(idx, { unit_price: Number(e.target.value) })}
            />
            <button
              type="button"
              onClick={() =>
                setItems((s) => (s.length === 1 ? s : s.filter((_, i) => i !== idx)))
              }
              className="h-9 flex items-center justify-center text-text-tertiary hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setItems((s) => [...s, { description: "", quantity: 1, unit_price: 0 }])
          }
          className="flex items-center gap-1.5 text-xs text-accent hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> {t("invoice.addItem")}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={`${t("invoice.taxRate")} (%)`}
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={taxRate as unknown as string}
          onChange={(e) => setTaxRate(Number(e.target.value))}
        />
        <Input
          label={`${t("invoice.discountRate")} (%)`}
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={discountRate as unknown as string}
          onChange={(e) => setDiscountRate(Number(e.target.value))}
        />
      </div>

      {/* Totals preview */}
      <div className="rounded-lg border border-border-subtle bg-bg-tertiary/40 p-4 space-y-1.5 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>{t("invoice.subtotal")}</span>
          <span>{formatCurrency(totals.subtotal, currency)}</span>
        </div>
        {totals.discountAmount > 0 && (
          <div className="flex justify-between text-text-secondary">
            <span>{t("invoice.discount")}</span>
            <span>-{formatCurrency(totals.discountAmount, currency)}</span>
          </div>
        )}
        {totals.taxAmount > 0 && (
          <div className="flex justify-between text-text-secondary">
            <span>{t("invoice.tax")}</span>
            <span>{formatCurrency(totals.taxAmount, currency)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-text-primary pt-1 border-t border-border-subtle">
          <span>{t("invoice.grandTotal")}</span>
          <span>{formatCurrency(totals.total, currency)}</span>
        </div>
      </div>

      {/* Schedule */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label={t("recurringInvoice.interval")}
          options={INTERVAL_OPTIONS}
          value={interval}
          onChange={(e) => setInterval(e.target.value as "monthly" | "quarterly" | "yearly")}
        />
        <Input
          label={t("recurringInvoice.dayOfMonth")}
          type="number"
          min="1"
          max="28"
          value={dayOfMonth as unknown as string}
          onChange={(e) => setDayOfMonth(Number(e.target.value))}
        />
        <Input
          label={t("recurringInvoice.dueDays")}
          type="number"
          min="1"
          max="90"
          value={dueDays as unknown as string}
          onChange={(e) => setDueDays(Number(e.target.value))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Textarea
          label={t("invoice.notes")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Textarea
          label={t("invoice.paymentTerms")}
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
        />
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
