"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeFlags, type Locale } from "@/i18n/config";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-border-subtle bg-bg-secondary p-1">
      <Globe className="ml-1 h-3.5 w-3.5 text-text-tertiary" />
      {locales.map((l) => (
        <button
          key={l}
          disabled={pending}
          onClick={() =>
            startTransition(() => {
              router.replace(pathname, { locale: l });
            })
          }
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            locale === l
              ? "bg-bg-tertiary text-text-primary"
              : "text-text-tertiary hover:text-text-primary"
          }`}
        >
          <span className="mr-1">{localeFlags[l]}</span>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
