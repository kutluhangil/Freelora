import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary text-text-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar profile={profile as Profile | null} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <PageTransition>{children}</PageTransition>
        </main>
        <MobileNav />
      </div>
      <CommandPalette />
      {profile && !(profile as Profile).onboarded && (
        <OnboardingModal profile={profile as Profile} />
      )}
    </div>
  );
}
