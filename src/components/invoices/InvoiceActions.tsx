"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Download, Send, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "@/i18n/navigation";
import { deleteInvoice, updateInvoiceStatus } from "@/lib/actions/invoices";
import type { Invoice } from "@/types/database";

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const t = useTranslations("invoice");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();

  function setStatus(status: Invoice["status"]) {
    start(async () => {
      try {
        await updateInvoiceStatus(invoice.id, status);
        toast.success(tc("save"));
        router.refresh();
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function onDelete() {
    if (!confirm("Delete this invoice?")) return;
    start(async () => {
      try {
        await deleteInvoice(invoice.id);
        router.replace("/invoices");
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={`/api/invoices/generate-pdf?id=${invoice.id}&locale=${locale}`} target="_blank" rel="noopener">
        <Button variant="secondary" size="sm">
          <Download className="h-3.5 w-3.5" />
          {t("downloadPdf")}
        </Button>
      </a>
      {invoice.status === "draft" && (
        <Button size="sm" disabled={pending} onClick={() => setStatus("sent")}>
          <Send className="h-3.5 w-3.5" />
          {t("send")}
        </Button>
      )}
      {invoice.status === "sent" || invoice.status === "overdue" ? (
        <Button size="sm" disabled={pending} onClick={() => setStatus("paid")}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          {t("markPaid")}
        </Button>
      ) : null}
      <Button variant="ghost" size="sm" disabled={pending} onClick={onDelete}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
