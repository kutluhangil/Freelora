"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowDownRight, ArrowUpRight, MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { Drawer } from "@/components/ui/Drawer";
import { TransactionForm } from "./TransactionForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { findCategory } from "@/lib/constants/categories";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { Receipt } from "lucide-react";
import { deleteTransaction } from "@/lib/actions/transactions";
import type { Transaction, Project, Client } from "@/types/database";

interface Props {
  transactions: Transaction[];
  projects: Pick<Project, "id" | "name">[];
  clients: Pick<Client, "id" | "name">[];
  defaultType: "income" | "expense";
}

export function TransactionList({ transactions, projects, clients, defaultType }: Props) {
  const t = useTranslations();
  const locale = useLocale() as "tr" | "en";
  const [drawer, setDrawer] = useState<{ open: boolean; tx?: Transaction | null }>({ open: false });
  const [pending, start] = useTransition();

  function onDelete(id: string) {
    if (!confirm(t("transaction.deleteConfirm"))) return;
    start(async () => {
      try {
        await deleteTransaction(id);
        toast.success(t("transaction.deleted"));
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  if (!transactions.length) {
    return (
      <>
        <EmptyState
          icon={Receipt}
          title={t("dashboard.noTransactions")}
          description={
            defaultType === "income"
              ? t("transaction.addIncome")
              : t("transaction.addExpense")
          }
          action={
            <Button onClick={() => setDrawer({ open: true })}>
              {defaultType === "income" ? t("transaction.addIncome") : t("transaction.addExpense")}
            </Button>
          }
        />
        <Drawer
          open={drawer.open}
          onClose={() => setDrawer({ open: false })}
          title={defaultType === "income" ? t("transaction.addIncome") : t("transaction.addExpense")}
        >
          <TransactionForm
            type={defaultType}
            projects={projects}
            clients={clients}
            onDone={() => setDrawer({ open: false })}
          />
        </Drawer>
      </>
    );
  }

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>{t("transaction.description")}</Th>
            <Th>{t("transaction.category")}</Th>
            <Th>{t("transaction.project")}</Th>
            <Th className="text-right">{t("common.date")}</Th>
            <Th className="text-right">{t("common.amount")}</Th>
            <Th className="w-10" />
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((tx) => {
            const cat = findCategory(tx.category);
            const project = projects.find((p) => p.id === tx.project_id);
            return (
              <Tr key={tx.id} className="cursor-pointer" onClick={() => setDrawer({ open: true, tx })}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                        tx.type === "income"
                          ? "bg-success-muted text-success"
                          : "bg-danger-muted text-danger"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{tx.description}</p>
                      {tx.is_recurring && (
                        <p className="text-[10px] uppercase tracking-wide text-text-tertiary">
                          {t("transaction.recurring")}
                        </p>
                      )}
                    </div>
                  </div>
                </Td>
                <Td className="text-xs text-text-secondary">
                  {cat?.emoji} {cat ? t(cat.labelKey) : tx.category}
                </Td>
                <Td className="text-xs text-text-tertiary">{project?.name ?? "—"}</Td>
                <Td className="text-right text-xs text-text-tertiary">
                  {formatDate(tx.date, "dd MMM yyyy", locale)}
                </Td>
                <Td className="text-right">
                  <span
                    className={`font-mono text-sm font-medium ${
                      tx.type === "income" ? "text-success" : "text-danger"
                    }`}
                    data-tabular
                  >
                    {tx.type === "income" ? "+" : "−"}
                    {formatCurrency(Number(tx.amount), tx.currency, locale === "tr" ? "tr-TR" : "en-US")}
                  </span>
                </Td>
                <Td className="text-right">
                  <button
                    disabled={pending}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(tx.id);
                    }}
                    className="rounded p-1 text-text-tertiary hover:bg-danger-muted hover:text-danger transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Drawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false })}
        title={drawer.tx ? t("transaction.edit") : defaultType === "income" ? t("transaction.addIncome") : t("transaction.addExpense")}
      >
        {drawer.open && (
          <TransactionForm
            type={drawer.tx?.type ?? defaultType}
            initial={drawer.tx}
            projects={projects}
            clients={clients}
            onDone={() => setDrawer({ open: false })}
          />
        )}
      </Drawer>
    </>
  );
}
