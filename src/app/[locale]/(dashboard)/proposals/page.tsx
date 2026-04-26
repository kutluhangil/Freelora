import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProposalList } from "@/components/proposals/ProposalList";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProposalFormWrapper } from "@/components/proposals/ProposalFormWrapper";

export default async function ProposalsPage({
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

  const [{ data: proposals }, { data: clients }] = await Promise.all([
    supabase
      .from("proposals")
      .select("*, clients(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("clients")
      .select("id, name, currency")
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold tracking-tight">
          {t("proposal.title")}
        </h1>
        <ProposalFormWrapper clients={clients ?? []} t_newProposal={t("proposal.newProposal")} t_title={t("proposal.newProposal")} />
      </div>

      <ProposalList proposals={(proposals ?? []) as never} clients={clients ?? []} />
    </div>
  );
}
