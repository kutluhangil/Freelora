export interface TaxDateTemplate {
  type: "kdv" | "muhtasar" | "gecici_vergi" | "gelir_vergisi" | "sgk" | "bagkur" | "custom" | "us_quarterly" | "vat_eu";
  titleKey: string;
  country: string;
  /** months are 1-indexed; null means "every month" */
  months: number[] | null;
  day: number;
  recurring_interval: "monthly" | "quarterly" | "yearly";
}

export const TR_TAX_DATES: TaxDateTemplate[] = [
  {
    type: "kdv",
    titleKey: "tax.kdv",
    country: "TR",
    months: null,
    day: 28,
    recurring_interval: "monthly",
  },
  {
    type: "muhtasar",
    titleKey: "tax.muhtasar",
    country: "TR",
    months: [1, 4, 7, 10],
    day: 26,
    recurring_interval: "quarterly",
  },
  {
    type: "gecici_vergi",
    titleKey: "tax.geciciVergi",
    country: "TR",
    months: [2, 5, 8, 11],
    day: 17,
    recurring_interval: "quarterly",
  },
  {
    type: "gelir_vergisi",
    titleKey: "tax.gelirVergisi",
    country: "TR",
    months: [3],
    day: 31,
    recurring_interval: "yearly",
  },
  {
    type: "sgk",
    titleKey: "tax.sgk",
    country: "TR",
    months: null,
    day: 28,
    recurring_interval: "monthly",
  },
  {
    type: "bagkur",
    titleKey: "tax.bagkur",
    country: "TR",
    months: null,
    day: 28,
    recurring_interval: "monthly",
  },
];

export const US_TAX_DATES: TaxDateTemplate[] = [
  {
    type: "us_quarterly",
    titleKey: "tax.usQuarterly",
    country: "US",
    months: [4, 6, 9, 1],
    day: 15,
    recurring_interval: "quarterly",
  },
];

export function getTaxDatesForCountry(country: string): TaxDateTemplate[] {
  if (country === "TR") return TR_TAX_DATES;
  if (country === "US") return US_TAX_DATES;
  return [];
}

export function generateUpcomingTaxDates(
  country: string,
  monthsAhead: number = 6
): { type: string; titleKey: string; due_date: string; recurring_interval: string }[] {
  const templates = getTaxDatesForCountry(country);
  const today = new Date();
  const upcoming: { type: string; titleKey: string; due_date: string; recurring_interval: string }[] = [];

  for (let m = 0; m < monthsAhead; m++) {
    const d = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const month = d.getMonth() + 1;
    for (const tpl of templates) {
      if (tpl.months !== null && !tpl.months.includes(month)) continue;
      const dueDate = new Date(d.getFullYear(), d.getMonth(), tpl.day);
      if (dueDate < today) continue;
      upcoming.push({
        type: tpl.type,
        titleKey: tpl.titleKey,
        due_date: dueDate.toISOString().split("T")[0],
        recurring_interval: tpl.recurring_interval,
      });
    }
  }
  return upcoming.sort((a, b) => a.due_date.localeCompare(b.due_date));
}
