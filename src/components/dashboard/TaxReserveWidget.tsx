"use client";

import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";

const TR_BRACKETS = [
  { limit: 110_000, rate: 0.15 },
  { limit: 230_000, rate: 0.20 },
  { limit: 870_000, rate: 0.27 },
  { limit: 3_000_000, rate: 0.35 },
  { limit: Infinity, rate: 0.40 },
];

function calcProgressiveTax(income: number): number {
  let tax = 0;
  let prev = 0;
  for (const bracket of TR_BRACKETS) {
    const taxable = Math.min(income, bracket.limit) - prev;
    if (taxable <= 0) break;
    tax += taxable * bracket.rate;
    prev = bracket.limit;
    if (income <= bracket.limit) break;
  }
  return tax;
}

interface Props {
  ytdIncome: number;
  currency: string;
}

export function TaxReserveWidget({ ytdIncome, currency }: Props) {
  const { estimatedTax, effectiveRate, recommended } = useMemo(() => {
    const estimatedTax = calcProgressiveTax(ytdIncome);
    const effectiveRate = ytdIncome > 0 ? (estimatedTax / ytdIncome) * 100 : 0;
    const recommended = ytdIncome * (effectiveRate / 100);
    return { estimatedTax, effectiveRate, recommended };
  }, [ytdIncome]);

  const segments = TR_BRACKETS.filter((_, i) => i < 4).map((b, i) => {
    const prev = i === 0 ? 0 : TR_BRACKETS[i - 1].limit;
    const active = ytdIncome > prev;
    return { ...b, prev, active };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-accent" />
        <div>
          <p className="text-xs text-text-muted">Tahmini Vergi Yükü</p>
          <p className="text-lg font-bold text-text-primary font-mono">
            {formatCurrency(recommended, currency)}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-text-muted">Efektif Oran</p>
          <p className="text-sm font-semibold text-text-secondary">
            %{effectiveRate.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                seg.active ? "bg-accent" : "bg-border-subtle"
              }`}
            />
            <span className={seg.active ? "text-text-secondary" : "text-text-muted"}>
              %{(seg.rate * 100).toFixed(0)} dilimi
            </span>
            <span className="ml-auto text-text-muted">
              {(seg.prev / 1000).toFixed(0)}K–
              {seg.limit === Infinity ? "∞" : `${(seg.limit / 1000).toFixed(0)}K`} TRY
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-text-muted leading-relaxed">
        Türkiye gelir vergisi dilimlerine göre tahmini hesaplamadır. Gerçek vergi için muhasebeciye danışın.
      </p>
    </div>
  );
}
