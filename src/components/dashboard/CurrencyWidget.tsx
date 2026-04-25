import { createAdminClient } from "@/lib/supabase/admin";

const PAIRS: { from: string; to: string; flag: string }[] = [
  { from: "USD", to: "TRY", flag: "🇺🇸" },
  { from: "EUR", to: "TRY", flag: "🇪🇺" },
  { from: "GBP", to: "TRY", flag: "🇬🇧" },
];

export async function CurrencyWidget() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("exchange_rates")
    .select("base_currency,target_currency,rate")
    .eq("base_currency", "USD");

  const usdRates = new Map((data ?? []).map((r) => [r.target_currency, Number(r.rate)]));
  const usdTry = usdRates.get("TRY") ?? 0;

  function rateFor(from: string): number {
    if (from === "USD") return usdTry;
    const fromUsd = usdRates.get(from);
    if (!fromUsd || !usdTry) return 0;
    return usdTry / fromUsd;
  }

  return (
    <ul className="space-y-2">
      {PAIRS.map((p) => (
        <li
          key={p.from}
          className="flex items-center justify-between rounded-md bg-bg-tertiary/50 px-3 py-2"
        >
          <span className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="text-base">{p.flag}</span>
            <span className="font-mono">{p.from}/TRY</span>
          </span>
          <span className="font-mono text-sm font-medium text-text-primary" data-tabular>
            ₺{rateFor(p.from).toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  );
}
