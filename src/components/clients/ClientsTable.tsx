"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus, Trash2, Mail, Phone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { ClientForm } from "./ClientForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { Users } from "lucide-react";
import { deleteClient } from "@/lib/actions/clients";
import type { Client } from "@/types/database";

export function ClientsTable({ clients }: { clients: Client[] }) {
  const t = useTranslations();
  const [drawer, setDrawer] = useState<{ open: boolean; client?: Client | null }>({ open: false });
  const [pending, start] = useTransition();

  function onDelete(id: string) {
    if (!confirm(t("transaction.deleteConfirm"))) return;
    start(async () => {
      try {
        await deleteClient(id);
        toast.success(t("transaction.deleted"));
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  return (
    <>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">{t("client.title")}</h1>
          <p className="mt-1 text-xs text-text-tertiary">{clients.length}</p>
        </div>
        <Button onClick={() => setDrawer({ open: true })} size="sm">
          <Plus className="h-3.5 w-3.5" />
          {t("client.new")}
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState icon={Users} title={t("client.noClients")} />
      ) : (
        <div className="rounded-lg border border-border-subtle bg-bg-secondary">
          <Table>
            <Thead>
              <Tr>
                <Th>{t("client.name")}</Th>
                <Th>{t("client.company")}</Th>
                <Th>{t("client.email")}</Th>
                <Th>{t("client.phone")}</Th>
                <Th>{t("client.country")}</Th>
                <Th className="w-10" />
              </Tr>
            </Thead>
            <Tbody>
              {clients.map((c) => (
                <Tr
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => setDrawer({ open: true, client: c })}
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-muted text-[10px] font-semibold uppercase text-accent">
                        {c.name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                  </Td>
                  <Td className="text-xs text-text-secondary">
                    {c.company ? (
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {c.company}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td className="text-xs text-text-tertiary">
                    {c.email ? (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {c.email}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td className="text-xs text-text-tertiary">
                    {c.phone ? (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {c.phone}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td className="text-xs text-text-tertiary">{c.country ?? "—"}</Td>
                  <Td className="text-right">
                    <button
                      disabled={pending}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(c.id);
                      }}
                      className="rounded p-1 text-text-tertiary hover:bg-danger-muted hover:text-danger transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}

      <Drawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false })}
        title={drawer.client ? t("client.edit") : t("client.new")}
      >
        {drawer.open && (
          <ClientForm initial={drawer.client} onDone={() => setDrawer({ open: false })} />
        )}
      </Drawer>
    </>
  );
}
