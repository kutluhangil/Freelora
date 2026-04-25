import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary px-4 py-10">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="absolute left-6 top-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-text">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold tracking-tight">Freelora</span>
        </Link>
      </div>

      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
