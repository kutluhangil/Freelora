import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-text">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold tracking-tight">Freelora</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary">
          <Link href="/pricing" className="hover:text-text-primary transition-colors">
            {t("pricing.title")}
          </Link>
          <Link href="/login" className="hover:text-text-primary transition-colors">
            {t("auth.signIn")}
          </Link>
          <Link href="/register" className="hover:text-text-primary transition-colors">
            {t("auth.signUp")}
          </Link>
          <LanguageSwitcher />
        </div>
        <p className="text-[11px] text-text-muted">© {new Date().getFullYear()} · {t("landing.footerMadeBy")}</p>
      </div>
    </footer>
  );
}
