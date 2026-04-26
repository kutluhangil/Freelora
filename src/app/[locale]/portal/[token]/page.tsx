import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils/currency";
import type { Invoice, InvoiceStatus } from "@/types/database";

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Taslak",
  sent: "Gönderildi",
  paid: "Ödendi",
  overdue: "Gecikmiş",
  canceled: "İptal",
};

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: "bg-bg-elevated text-text-secondary",
  sent: "bg-blue-500/15 text-blue-400",
  paid: "bg-green-500/15 text-green-400",
  overdue: "bg-red-500/15 text-red-400",
  canceled: "bg-bg-elevated text-text-tertiary",
};

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: client } = await admin
    .from("clients")
    .select("id, name, user_id, profiles!clients_user_id_fkey(full_name, company_name)")
    .eq("portal_token", token)
    .maybeSingle();

  if (!client) notFound();

  const { data: invoices } = await admin
    .from("invoices")
    .select("id, invoice_number, issue_date, due_date, total, currency, status")
    .eq("user_id", client.user_id)
    .eq("client_id", client.id)
    .neq("status", "draft")
    .order("issue_date", { ascending: false });

  const freelancer = (client.profiles as unknown) as { full_name: string | null; company_name: string | null } | null;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://freelora.app";

  const totalPaid = (invoices ?? [])
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.total, 0);

  const totalPending = (invoices ?? [])
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + i.total, 0);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="font-display text-2xl font-bold text-accent">Freelora</p>
        </div>

        <div className="rounded-2xl border border-border-default bg-bg-secondary p-6">
          <h1 className="font-display text-xl font-bold">
            {freelancer?.company_name ?? freelancer?.full_name ?? "—"} · Faturalarınız
          </h1>
          <p className="mt-1 text-sm text-text-tertiary">{client.name}</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border-subtle bg-bg-secondary p-4">
            <p className="text-xs text-text-tertiary">Ödenen</p>
            <p className="mt-1 text-xl font-bold text-green-400">
              {formatCurrency(totalPaid, (invoices ?? [])[0]?.currency ?? "TRY")}
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-bg-secondary p-4">
            <p className="text-xs text-text-tertiary">Bekleyen</p>
            <p className="mt-1 text-xl font-bold text-yellow-400">
              {formatCurrency(totalPending, (invoices ?? [])[0]?.currency ?? "TRY")}
            </p>
          </div>
        </div>

        {/* Invoice list */}
        <div className="space-y-2">
          {(invoices ?? []).length === 0 ? (
            <p className="text-center py-10 text-sm text-text-tertiary">Henüz fatura yok.</p>
          ) : (
            (invoices as Invoice[]).map((inv) => (
              <div
                key={inv.id}
                className="flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-secondary px-5 py-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{inv.invoice_number}</p>
                  <p className="text-xs text-text-tertiary">
                    Vade: {inv.due_date}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[inv.status]}`}>
                  {STATUS_LABELS[inv.status]}
                </span>
                <p className="text-sm font-bold tabular-nums shrink-0">
                  {formatCurrency(inv.total, inv.currency)}
                </p>
                <a
                  href={`${appUrl}/api/invoices/generate-pdf?id=${inv.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline shrink-0"
                >
                  PDF
                </a>
              </div>
            ))
          )}
        </div>

        <p className="text-center text-xs text-text-tertiary">
          Freelora Müşteri Portalı · freelora.app
        </p>
      </div>
    </div>
  );
}
