"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createClient } from "@/lib/supabase/client";
import { CURRENCIES } from "@/lib/constants/currencies";
import { seedTaxRemindersFromCountry } from "@/lib/actions/tax-reminders";
import type { Profile } from "@/types/database";

const STEPS = ["welcome", "profile", "currency", "taxes"] as const;
type Step = (typeof STEPS)[number];

const COUNTRY_OPTIONS = [
  { value: "TR", label: "🇹🇷 Türkiye" },
  { value: "US", label: "🇺🇸 United States" },
  { value: "DE", label: "🇩🇪 Germany" },
  { value: "GB", label: "🇬🇧 United Kingdom" },
  { value: "NL", label: "🇳🇱 Netherlands" },
  { value: "FR", label: "🇫🇷 France" },
  { value: "Other", label: "🌍 Other" },
];

export function OnboardingModal({ profile }: { profile: Profile }) {
  const t = useTranslations();
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    full_name: profile.full_name ?? "",
    company_name: profile.company_name ?? "",
    country: profile.country ?? "TR",
    preferred_currency: profile.preferred_currency ?? "TRY",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  const stepIndex = STEPS.indexOf(step);
  const isLast = step === "taxes";

  function next() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }

  function handleFinish() {
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ ...form, onboarded: true } as never)
        .eq("id", profile.id);
      if (error) { toast.error(error.message); return; }

      await seedTaxRemindersFromCountry();

      toast.success(t("onboarding.done"));
      router.refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md rounded-2xl border border-border-default bg-bg-secondary shadow-lg"
      >
        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 px-6 pt-6">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stepIndex ? "bg-accent" : "bg-bg-elevated"
              } ${i === stepIndex ? "w-6" : "w-1.5"}`}
            />
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === "welcome" && (
                <div className="text-center">
                  <p className="text-4xl">👋</p>
                  <h2 className="mt-4 font-display text-xl font-bold">{t("onboarding.welcome")}</h2>
                  <p className="mt-2 text-sm text-text-secondary">{t("onboarding.welcomeDesc")}</p>
                </div>
              )}

              {step === "profile" && (
                <div className="space-y-4">
                  <h2 className="font-display text-lg font-bold">{t("onboarding.profileTitle")}</h2>
                  <Input
                    label={t("auth.fullName")}
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                  />
                  <Input
                    label={t("settings.companyName")}
                    value={form.company_name}
                    onChange={(e) => set("company_name", e.target.value)}
                  />
                  <Select
                    label={t("client.country")}
                    options={COUNTRY_OPTIONS}
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  />
                </div>
              )}

              {step === "currency" && (
                <div className="space-y-4">
                  <h2 className="font-display text-lg font-bold">{t("onboarding.currencyTitle")}</h2>
                  <p className="text-sm text-text-secondary">{t("onboarding.currencyDesc")}</p>
                  <Select
                    label={t("settings.preferredCurrency")}
                    options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.flag} ${c.code} — ${c.name}` }))}
                    value={form.preferred_currency}
                    onChange={(e) => set("preferred_currency", e.target.value)}
                  />
                </div>
              )}

              {step === "taxes" && (
                <div className="space-y-4">
                  <h2 className="font-display text-lg font-bold">{t("onboarding.taxTitle")}</h2>
                  <p className="text-sm text-text-secondary">{t("onboarding.taxDesc")}</p>
                  {(form.country === "TR" || form.country === "US") && (
                    <div className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent-muted p-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <p className="text-sm text-text-primary">
                        {form.country === "TR" ? t("onboarding.trTaxDates") : t("onboarding.usTaxDates")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle p-4">
          {stepIndex > 0 ? (
            <button
              onClick={() => setStep(STEPS[stepIndex - 1])}
              className="text-sm text-text-tertiary hover:text-text-primary"
            >
              {t("common.back")}
            </button>
          ) : <span />}
          {isLast ? (
            <Button loading={pending} onClick={handleFinish}>
              {t("onboarding.finish")}
            </Button>
          ) : (
            <Button onClick={next}>{t("common.next")}</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
