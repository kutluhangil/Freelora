"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { TransactionForm } from "./TransactionForm";
import type { Project, Client } from "@/types/database";

interface Props {
  type: "income" | "expense";
  projects: Pick<Project, "id" | "name">[];
  clients: Pick<Client, "id" | "name">[];
}

export function AddTransactionButton({ type, projects, clients }: Props) {
  const t = useTranslations("transaction");
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-3.5 w-3.5" />
        {type === "income" ? t("addIncome") : t("addExpense")}
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={type === "income" ? t("addIncome") : t("addExpense")}
      >
        <TransactionForm
          type={type}
          projects={projects}
          clients={clients}
          onDone={() => setOpen(false)}
        />
      </Drawer>
    </>
  );
}
