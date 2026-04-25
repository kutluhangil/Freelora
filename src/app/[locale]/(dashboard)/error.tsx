"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
      <AlertTriangle className="h-10 w-10 text-danger" />
      <div className="text-center">
        <h2 className="font-display text-lg font-bold text-text-primary">Bir hata oluştu</h2>
        <p className="mt-1 text-sm text-text-tertiary">
          {error.message || "Beklenmeyen bir hata oluştu."}
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-md bg-bg-elevated px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Sayfayı yenile
      </button>
    </div>
  );
}
