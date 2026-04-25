"use client";

import { useRef, useState } from "react";
import { Paperclip, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  userId: string;
}

export function ReceiptUpload({ value, onChange, userId }: Props) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("transaction.receiptTooLarge"));
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("receipts").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("receipts").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success(t("transaction.receiptUploaded"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!value) return;
    const supabase = createClient();
    const path = value.split("/receipts/")[1];
    if (path) await supabase.storage.from("receipts").remove([path]);
    onChange(null);
  }

  return (
    <div className="space-y-1">
      <label className="text-xs text-text-secondary">{t("transaction.receipt")}</label>
      {value ? (
        <div className="flex items-center gap-2 rounded-md border border-border-subtle bg-bg-tertiary px-3 py-2">
          <Paperclip className="h-3.5 w-3.5 shrink-0 text-accent" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate text-xs text-text-secondary hover:text-accent"
          >
            {t("transaction.viewReceipt")}
          </a>
          <button onClick={handleRemove} className="text-text-tertiary hover:text-danger">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center gap-2 rounded-md border border-dashed border-border-default bg-bg-tertiary px-3 py-2.5 text-xs text-text-tertiary transition-colors hover:border-accent hover:text-text-primary disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Paperclip className="h-3.5 w-3.5" />
          )}
          {uploading ? t("common.loading") : t("transaction.uploadReceipt")}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
