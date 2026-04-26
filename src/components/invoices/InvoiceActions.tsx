"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Download, Send, CheckCircle2, Trash2, Mail } from "lucide-react";
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
  const [sending, setSending] = useState(false);

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
    if (!confirm(t("deleteConfirm"))) return;
    start(async () => {
      try {
        await deleteInvoice(invoice.id);
        router.replace("/invoices");
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  async function onSendEmail() {
    setSending(true);
    try {
      const res = await fetch("/api/invoices/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success(t("emailSent"));
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={`/api/invoices/generate-pdf?id=${invoice.id}&locale=${locale}`} target="_blank" rel="noopener">
        <Button variant="secondary" size="sm">
          <Download className="h-3.5 w-3.5" />
          {t("downloadPdf")}
        </Button>
      </a>
      {(invoice.status === "draft" || invoice.status === "sent") && (
        <Button variant="outline" size="sm" loading={sending} onClick={onSendEmail}>
          <Mail className="h-3.5 w-3.5" />
          {t("sendEmail")}
        </Button>
      )}
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
