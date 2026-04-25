import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary text-text-primary">
      <p className="font-mono text-8xl font-bold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Sayfa bulunamadı</h1>
      <p className="mt-2 text-sm text-text-tertiary">Page not found</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-text transition-colors hover:bg-accent-hover"
      >
        <Home className="h-4 w-4" />
        Ana sayfa
      </Link>
    </div>
  );
}
