import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TimerWidget } from "@/components/time-tracker/TimerWidget";
import { TimeEntriesList } from "@/components/time-tracker/TimeEntriesList";
import type { TimeEntry } from "@/types/database";

export default async function TimeTrackerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const [
    { data: activeEntry },
    { data: entries },
    { data: projects },
    { data: clients },
  ] = await Promise.all([
    supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", user.id)
      .is("end_time", null)
      .maybeSingle(),
    supabase
      .from("time_entries")
      .select("*, projects(name, color)")
      .eq("user_id", user.id)
      .not("end_time", "is", null)
      .order("start_time", { ascending: false })
      .limit(50),
    supabase
      .from("projects")
      .select("id, name")
      .eq("user_id", user.id)
      .eq("status", "active"),
    supabase.from("clients").select("id, name").eq("user_id", user.id).eq("is_active", true),
  ]);

  const totalMinutes = (entries ?? []).reduce(
    (s, e) => s + (e.duration_minutes ?? 0),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold tracking-tight">
          {t("timeTracker.title")}
        </h1>
        <span className="text-sm text-text-tertiary">
          {t("timeTracker.totalHours")}: <span className="font-semibold text-text-primary">{totalHours}s</span>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <TimerWidget
          activeEntry={activeEntry as TimeEntry | null}
          projects={projects ?? []}
          clients={clients ?? []}
        />
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-text-secondary">{t("timeTracker.recentEntries")}</h2>
          <TimeEntriesList entries={(entries ?? []) as never} />
        </div>
      </div>
    </div>
  );
}
