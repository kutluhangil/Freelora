"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { toCSV, downloadCSV } from "@/lib/utils/csv";
import { Button } from "@/components/ui/Button";
import type { TransactionType } from "@/types/database";

export function ExportCSVButton({ type }: { type: TransactionType }) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("transactions")
        .select("date,description,category,amount,currency,amount_in_base,project_id,notes")
        .eq("type", type)
        .order("date", { ascending: false });

      if (error) throw error;
      if (!data?.length) {
        toast.error(t("common.noData"));
        return;
      }

      const csv = toCSV(data as Record<string, unknown>[]);
      const filename = `freelora-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
      downloadCSV(csv, filename);
      toast.success(t("common.exportSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" loading={loading} onClick={handleExport}>
      <Download className="h-3.5 w-3.5" />
      CSV
    </Button>
  );
}
