"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Copy, Trash2, FileText, CheckCircle, XCircle, Send, Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProposalForm } from "@/components/proposals/ProposalForm";
import { formatCurrency } from "@/lib/utils/currency";
import { deleteProposal, updateProposalStatus, convertProposalToInvoice } from "@/lib/actions/proposals";
import type { Proposal, Client, ProposalStatus } from "@/types/database";

interface ProposalWithClient extends Proposal {
  clients: Pick<Client, "name"> | null;
}

interface Props {
  proposals: ProposalWithClient[];
  clients: Pick<Client, "id" | "name" | "currency">[];
}

const STATUS_COLORS: Record<ProposalStatus, string> = {
  draft: "bg-bg-elevated text-text-secondary",
  sent: "bg-blue-500/15 text-blue-400",
  accepted: "bg-green-500/15 text-green-400",
  rejected: "bg-red-500/15 text-red-400",
};

export function ProposalList({ proposals, clients }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [, start] = useTransition();
  const [editTarget, setEditTarget] = useState<Proposal | null>(null);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${appUrl}/p/${token}`);
    toast.success(t("proposal.linkCopied"));
  }

  function handleDelete(id: string) {
    if (!confirm(t("common.confirm"))) return;
    start(async () => {
      try {
        await deleteProposal(id);
        toast.success(t("common.delete") + " ✓");
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function handleStatus(id: string, status: ProposalStatus) {
    start(async () => {
      try {
        await updateProposalStatus(id, status);
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function handleConvert(id: string) {
    start(async () => {
      try {
        const invoiceId = await convertProposalToInvoice(id);
        toast.success(t("proposal.converted"));
        router.push(`/invoices/${invoiceId}`);
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle py-16 text-center">
        <FileText className="h-8 w-8 text-text-tertiary mb-3" />
        <p className="text-sm text-text-secondary">{t("proposal.noProposals")}</p>
        <p className="mt-1 text-xs text-text-tertiary">{t("proposal.noProposalsHint")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {proposals.map((p) => (
          <div
            key={p.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border-subtle bg-bg-secondary px-5 py-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-text-primary truncate">{p.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status]}`}>
                  {t(`proposal.status.${p.status}`)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-text-tertiary">
                {p.clients?.name ?? "—"}
                {p.valid_until && ` · ${t("proposal.validUntil")}: ${p.valid_until}`}
              </p>
            </div>

            <p className="text-sm font-bold tabular-nums shrink-0">
              {formatCurrency(p.total, p.currency)}
            </p>

            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => copyLink(p.public_token)}
                title={t("proposal.shareLink")}
                className="rounded-md p-1.5 text-text-tertiary hover:bg-bg-elevated hover:text-text-primary"
              >
                <Copy className="h-4 w-4" />
              </button>

              {p.status === "draft" && (
                <button
                  onClick={() => handleStatus(p.id, "sent")}
                  title={t("proposal.markSent")}
                  className="rounded-md p-1.5 text-text-tertiary hover:bg-bg-elevated hover:text-blue-400"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}

              {p.status === "sent" && (
                <>
                  <button
                    onClick={() => handleStatus(p.id, "accepted")}
                    title={t("proposal.accept")}
                    className="rounded-md p-1.5 text-text-tertiary hover:bg-bg-elevated hover:text-green-400"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleStatus(p.id, "rejected")}
                    title={t("proposal.reject")}
                    className="rounded-md p-1.5 text-text-tertiary hover:bg-bg-elevated hover:text-red-400"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </>
              )}

              {p.status === "accepted" && (
                <button
                  onClick={() => handleConvert(p.id)}
                  title={t("proposal.convertToInvoice")}
                  className="rounded-md p-1.5 text-text-tertiary hover:bg-bg-elevated hover:text-accent"
                >
                  <Receipt className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => setEditTarget(p)}
                className="rounded-md p-1.5 text-text-tertiary hover:bg-bg-elevated hover:text-text-primary"
              >
                <FileText className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="rounded-md p-1.5 text-text-tertiary hover:bg-bg-elevated hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={t("proposal.editProposal")}
      >
        {editTarget && (
          <ProposalForm
            clients={clients}
            initial={editTarget}
            onDone={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </>
  );
}
