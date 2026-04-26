import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils/currency";
import { ProposalAcceptButton } from "@/components/proposals/ProposalAcceptButton";
import type { ProposalItem } from "@/types/database";

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ token: string; locale: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: proposal } = await admin
    .from("proposals")
    .select("*, clients(name, email), profiles!proposals_user_id_fkey(full_name, company_name, email)")
    .eq("public_token", token)
    .maybeSingle();

  if (!proposal) notFound();

  const items = proposal.items as ProposalItem[];
  const freelancer = proposal.profiles as { full_name: string | null; company_name: string | null; email: string } | null;
  const client = proposal.clients as { name: string; email: string | null } | null;
  const isExpired = proposal.valid_until && new Date(proposal.valid_until) < new Date();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <p className="font-display text-2xl font-bold text-accent">Freelora</p>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            proposal.status === "accepted" ? "bg-green-500/15 text-green-400" :
            proposal.status === "rejected" ? "bg-red-500/15 text-red-400" :
            "bg-blue-500/15 text-blue-400"
          }`}>
            {proposal.status.toUpperCase()}
          </span>
        </div>

        <div className="rounded-2xl border border-border-default bg-bg-secondary p-8 space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold">{proposal.title}</h1>
            {freelancer && (
              <p className="mt-1 text-sm text-text-tertiary">
                {freelancer.company_name ?? freelancer.full_name ?? freelancer.email}
              </p>
            )}
            {client && (
              <p className="mt-0.5 text-sm text-text-secondary">
                Kime: <span className="font-medium">{client.name}</span>
              </p>
            )}
          </div>

          {proposal.valid_until && (
            <p className={`text-sm ${isExpired ? "text-red-400" : "text-text-tertiary"}`}>
              Geçerlilik: {proposal.valid_until}
              {isExpired && " (Süresi doldu)"}
            </p>
          )}

          {/* Items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-text-tertiary text-left">
                <th className="pb-2 font-medium">Açıklama</th>
                <th className="pb-2 font-medium text-right">Miktar</th>
                <th className="pb-2 font-medium text-right">Birim Fiyat</th>
                <th className="pb-2 font-medium text-right">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-border-subtle/50">
                  <td className="py-3 pr-4">{item.description}</td>
                  <td className="py-3 text-right tabular-nums">{item.quantity}</td>
                  <td className="py-3 text-right tabular-nums">{formatCurrency(item.unit_price, proposal.currency)}</td>
                  <td className="py-3 text-right tabular-nums font-medium">{formatCurrency(item.total, proposal.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="space-y-1.5 text-sm border-t border-border-subtle pt-4">
            <div className="flex justify-between text-text-secondary">
              <span>Ara Toplam</span>
              <span>{formatCurrency(proposal.subtotal, proposal.currency)}</span>
            </div>
            {proposal.discount_amount > 0 && (
              <div className="flex justify-between text-text-secondary">
                <span>İndirim ({proposal.discount_rate}%)</span>
                <span>-{formatCurrency(proposal.discount_amount, proposal.currency)}</span>
              </div>
            )}
            {proposal.tax_amount > 0 && (
              <div className="flex justify-between text-text-secondary">
                <span>Vergi ({proposal.tax_rate}%)</span>
                <span>{formatCurrency(proposal.tax_amount, proposal.currency)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border-subtle">
              <span>Toplam</span>
              <span className="text-accent">{formatCurrency(proposal.total, proposal.currency)}</span>
            </div>
          </div>

          {proposal.notes && (
            <p className="text-sm text-text-tertiary italic border-t border-border-subtle pt-4">
              {proposal.notes}
            </p>
          )}

          {/* Accept / Reject */}
          {proposal.status === "sent" && !isExpired && (
            <ProposalAcceptButton token={token} />
          )}
        </div>

        <p className="mt-6 text-center text-xs text-text-tertiary">
          Bu teklif Freelora üzerinden oluşturulmuştur · freelora.app
        </p>
      </div>
    </div>
  );
}
