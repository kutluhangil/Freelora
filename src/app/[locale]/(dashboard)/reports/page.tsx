import { redirect } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default async function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
  const isPro = profile?.plan === "pro";

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="font-display text-xl font-bold tracking-tight">{t("nav.reports")}</h1>
      {!isPro ? (
        <EmptyState
          icon={BarChart3}
          title={t("plan.limitReached")}
          description={t("plan.upgradePrompt")}
          action={
            <Link href="/pricing">
              <Button>{t("plan.upgradeNow")}</Button>
            </Link>
          }
        />
      ) : (
        <p className="text-sm text-text-tertiary">{t("common.loading")}</p>
      )}
    </div>
  );
}
