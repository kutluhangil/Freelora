import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { ProfileForm } from "@/components/settings/ProfileForm";
import type { Profile } from "@/types/database";

export default async function ProfileSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) notFound();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
      >
        <ChevronLeft className="h-3 w-3" />
        {t("title")}
      </Link>
      <h1 className="font-display text-xl font-bold tracking-tight">{t("profile")}</h1>
      <ProfileForm profile={profile as Profile} />
    </div>
  );
}
