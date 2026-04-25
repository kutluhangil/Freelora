"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export function LandingNav() {
  const t = useTranslations();
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-text">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-sm font-semibold tracking-tight">Freelora</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            {t("pricing.title")}
          </Link>
          <LanguageSwitcher />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t("auth.signIn")}
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">{t("auth.signUp")}</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
