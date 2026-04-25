import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";

export default async function NewInvoicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from("clients").select("id,name,currency").eq("user_id", user.id).order("name"),
    supabase.from("projects").select("id,name,client_id").eq("user_id", user.id).order("name"),
  ]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Link
        href="/invoices"
        className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
      >
        <ChevronLeft className="h-3 w-3" />
        {t("invoice.title")}
      </Link>
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight">{t("invoice.newInvoice")}</h1>
      </div>
      <InvoiceForm clients={clients ?? []} projects={projects ?? []} />
    </div>
  );
}
