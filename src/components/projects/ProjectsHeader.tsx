"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { ProjectForm } from "./ProjectForm";
import type { Client } from "@/types/database";

export function ProjectsHeader({ clients }: { clients: Pick<Client, "id" | "name">[] }) {
  const t = useTranslations("project");
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-3.5 w-3.5" />
        {t("new")}
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title={t("new")}>
        {open && <ProjectForm clients={clients} onDone={() => setOpen(false)} />}
      </Drawer>
    </>
  );
}
