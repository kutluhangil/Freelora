"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProposalForm } from "@/components/proposals/ProposalForm";
import type { Client } from "@/types/database";

interface Props {
  clients: Pick<Client, "id" | "name" | "currency">[];
  t_newProposal: string;
  t_title: string;
}

export function ProposalFormWrapper({ clients, t_newProposal, t_title }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        {t_newProposal}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={t_title}>
        <ProposalForm clients={clients} onDone={() => setOpen(false)} />
      </Modal>
    </>
  );
}
