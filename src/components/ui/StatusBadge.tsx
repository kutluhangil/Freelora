"use client";

import { useTranslations } from "next-intl";
import { Badge } from "./Badge";
import type {
  ProjectStatus,
  InvoiceStatus,
} from "@/types/database";

type AnyStatus = ProjectStatus | InvoiceStatus;

const VARIANT_MAP: Record<string, "success" | "warning" | "danger" | "neutral" | "info" | "accent"> = {
  // project
  active: "accent",
  completed: "success",
  paused: "warning",
  canceled: "neutral",
  // invoice
  draft: "neutral",
  sent: "info",
  paid: "success",
  overdue: "danger",
};

interface Props {
  status: AnyStatus;
  scope?: "project" | "invoice";
}

export function StatusBadge({ status, scope = "invoice" }: Props) {
  const t = useTranslations(scope === "project" ? "project" : "invoice.status");
  const variant = VARIANT_MAP[status] ?? "neutral";
  return (
    <Badge variant={variant}>
      <span className="size-1.5 rounded-full bg-current" />
      {t(status)}
    </Badge>
  );
}
