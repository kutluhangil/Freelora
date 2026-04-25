"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-primary text-text-primary">
      <AlertTriangle className="h-12 w-12 text-danger" />
      <h1 className="font-display text-xl font-bold">Bir şeyler yanlış gitti</h1>
      <p className="text-sm text-text-tertiary">Something went wrong</p>
      {error.digest && (
        <p className="font-mono text-xs text-text-muted">{error.digest}</p>
      )}
      <button
        onClick={reset}
        className="mt-2 inline-flex items-center gap-2 rounded-md bg-bg-elevated px-4 py-2 text-sm text-text-primary transition-colors hover:bg-bg-tertiary"
      >
        <RefreshCw className="h-4 w-4" />
        Tekrar dene
      </button>
    </div>
  );
}
