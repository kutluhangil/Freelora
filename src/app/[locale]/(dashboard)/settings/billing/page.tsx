import { notFound, redirect } from "next/navigation";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/lib/constants/plans";
import type { Profile } from "@/types/database";

export default async function BillingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) notFound();

  const p = profile as Profile;
  const currentPlan = PLANS[p.plan as keyof typeof PLANS] ?? PLANS.free;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
      >
        <ChevronLeft className="h-3 w-3" />
        {t("settings.title")}
      </Link>
      <h1 className="font-display text-xl font-bold tracking-tight">{t("settings.billing")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("pricing.currentPlan")}</CardTitle>
          <Badge variant="accent">
            {t(`pricing.plans.${currentPlan.id}` as never)} · {p.plan_status}
          </Badge>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-text-secondary">
            {Object.entries(currentPlan.features).map(([k, v]) => {
              if (typeof v === "boolean" && !v) return null;
              return (
                <li key={k} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span className="font-mono text-xs text-text-tertiary">{k}</span>
                  <span className="ml-auto font-mono text-xs">
                    {typeof v === "boolean"
                      ? "✓"
                      : typeof v === "number"
                        ? v === Number.POSITIVE_INFINITY ? "∞" : v
                        : Array.isArray(v) ? v.join(", ") : v}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex justify-end">
            <Link href="/pricing">
              <Button>{t("plan.upgradeNow")}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
