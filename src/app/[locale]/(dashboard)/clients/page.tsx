import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientsTable } from "@/components/clients/ClientsTable";
import type { Client } from "@/types/database";

export default async function ClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ClientsTable clients={(data ?? []) as Client[]} />
    </div>
  );
}
