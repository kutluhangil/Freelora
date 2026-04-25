"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowDownRight, ArrowUpRight, Receipt } from "lucide-react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { findCategory } from "@/lib/constants/categories";
import type { Transaction } from "@/types/database";

interface Props {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: Props) {
  const t = useTranslations();
  const locale = useLocale() as "tr" | "en";

  if (!transactions.length) {
    return (
      <EmptyState
        icon={Receipt}
        title={t("dashboard.noTransactions")}
        action={
          <Link href="/income">
            <Button size="sm">{t("dashboard.addTransaction")}</Button>
          </Link>
        }
      />
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>{t("transaction.description")}</Th>
          <Th className="text-right">{t("common.date")}</Th>
          <Th className="text-right">{t("common.amount")}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {transactions.map((tx) => {
          const cat = findCategory(tx.category);
          return (
            <Tr key={tx.id}>
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
                    <p className="truncate text-sm font-medium text-text-primary">{tx.description}</p>
                    <p className="text-xs text-text-tertiary">
                      {cat?.emoji} {cat ? t(cat.labelKey) : tx.category}
                    </p>
                  </div>
                </div>
              </Td>
              <Td className="text-right text-xs text-text-tertiary">
                {formatDate(tx.date, "dd MMM", locale)}
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
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
