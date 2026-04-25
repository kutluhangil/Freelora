import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { ChevronRight, CreditCard, User, Sliders } from "lucide-react";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const items = [
    { href: "/settings/profile", icon: User, title: t("profile") },
    { href: "/settings/billing", icon: CreditCard, title: t("billing") },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="font-display text-xl font-bold tracking-tight">{t("title")}</h1>
      <div className="grid gap-3 max-w-xl">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="flex items-center justify-between p-4 hover:border-border-default transition-all">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-bg-tertiary p-2 text-text-tertiary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-text-tertiary" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
