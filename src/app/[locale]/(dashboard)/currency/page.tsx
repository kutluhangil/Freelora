import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { CURRENCIES } from "@/lib/constants/currencies";
import { formatDate } from "@/lib/utils/date";

export default async function CurrencyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const admin = createAdminClient();
  const { data: rates } = await admin
    .from("exchange_rates")
    .select("*")
    .eq("base_currency", "USD")
    .order("target_currency");

  const map = new Map((rates ?? []).map((r) => [r.target_currency, r]));
  const fetchedAt = rates?.[0]?.fetched_at;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight">{t("nav.currency")}</h1>
        {fetchedAt && (
          <p className="mt-1 text-xs text-text-tertiary">
            {formatDate(fetchedAt, "dd MMM yyyy HH:mm", locale as "tr" | "en")}
          </p>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>USD →</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <Thead>
              <Tr>
                <Th>{t("client.currency")}</Th>
                <Th className="text-right">USD</Th>
              </Tr>
            </Thead>
            <Tbody>
              {CURRENCIES.map((c) => {
                const r = map.get(c.code);
                return (
                  <Tr key={c.code}>
                    <Td>
                      <span className="mr-2">{c.flag}</span>
                      <span className="font-mono text-sm">{c.code}</span>
                      <span className="ml-2 text-xs text-text-tertiary">{c.name}</span>
                    </Td>
                    <Td className="text-right font-mono text-sm" data-tabular>
                      {r ? Number(r.rate).toFixed(4) : "—"}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
