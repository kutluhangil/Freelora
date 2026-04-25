import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ReminderCard } from "@/components/calendar/ReminderCard";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import type { TaxReminder } from "@/types/database";

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: reminders } = await supabase
    .from("tax_reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  const list = (reminders ?? []) as TaxReminder[];
  const upcoming = list.filter((r) => !r.is_completed);
  const completed = list.filter((r) => r.is_completed);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">{t("tax.title")}</h1>
          <p className="mt-1 text-xs text-text-tertiary">{list.length}</p>
        </div>
        <CalendarHeader />
      </div>

      {list.length === 0 && (
        <EmptyState
          icon={Calendar}
          title={t("tax.title")}
          description={t("tax.upcoming")}
        />
      )}

      {upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("tax.upcoming")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {upcoming.map((r) => (
                <ReminderCard key={r.id} reminder={r} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("tax.completed")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {completed.map((r) => (
                <ReminderCard key={r.id} reminder={r} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
