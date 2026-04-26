"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Edit2, Trash2, ToggleLeft, ToggleRight, Plus, RefreshCw } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { RecurringConfigForm } from "@/components/invoices/RecurringConfigForm";
import {
  deleteRecurringConfig,
  updateRecurringConfig,
} from "@/lib/actions/recurring-invoices";
import type { Client, RecurringInvoiceConfig } from "@/types/database";

interface Props {
  configs: RecurringInvoiceConfig[];
  clients: Pick<Client, "id" | "name" | "currency">[];
}

const INTERVAL_LABEL: Record<string, string> = {
  monthly: "Aylık",
  quarterly: "3 Aylık",
  yearly: "Yıllık",
};

export function RecurringConfigList({ configs: initial, clients }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [configs, setConfigs] = useState(initial);
  const [editing, setEditing] = useState<RecurringInvoiceConfig | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, start] = useTransition();

  function handleDone() {
    setEditing(null);
    setCreating(false);
    router.refresh();
  }

  async function handleToggle(config: RecurringInvoiceConfig) {
    start(async () => {
      try {
        await updateRecurringConfig(config.id, { is_active: !config.is_active });
        setConfigs((prev) =>
          prev.map((c) => (c.id === config.id ? { ...c, is_active: !c.is_active } : c))
        );
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm(t("recurringInvoice.deleteConfirm"))) return;
    start(async () => {
      try {
        await deleteRecurringConfig(id);
        setConfigs((prev) => prev.filter((c) => c.id !== id));
        toast.success(t("recurringInvoice.deleted"));
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-text-tertiary" />
          <span className="text-sm font-medium text-text-primary">
            {t("recurringInvoice.title")}
          </span>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" />
          {t("recurringInvoice.new")}
        </Button>
      </div>

      {configs.length === 0 ? (
        <p className="py-6 text-center text-xs text-text-muted">
          {t("recurringInvoice.noConfigs")}
        </p>
      ) : (
        <div className="divide-y divide-border-subtle rounded-lg border border-border-subtle">
          {configs.map((config) => (
            <div key={config.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    config.is_active ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {config.title}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {INTERVAL_LABEL[config.interval]} · Her ayın{" "}
                  {config.day_of_month}. günü · Vade {config.due_days} gün
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggle(config)}
                  disabled={pending}
                  className="p-1.5 text-text-tertiary hover:text-accent transition-colors"
                  title={config.is_active ? "Deaktif et" : "Aktif et"}
                >
                  {config.is_active ? (
                    <ToggleRight className="h-4 w-4 text-accent" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setEditing(config)}
                  className="p-1.5 text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(config.id)}
                  disabled={pending}
                  className="p-1.5 text-text-tertiary hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title={t("recurringInvoice.new")}
      >
        <RecurringConfigForm clients={clients} onDone={handleDone} />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={t("recurringInvoice.edit")}
      >
        {editing && (
          <RecurringConfigForm clients={clients} initial={editing} onDone={handleDone} />
        )}
      </Modal>
    </>
  );
}
