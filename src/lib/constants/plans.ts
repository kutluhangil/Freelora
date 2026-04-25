export type PlanTier = "free" | "basic" | "pro";

export interface PlanLimits {
  maxProjects: number;
  maxClients: number;
  maxInvoicesPerMonth: number;
  maxTransactionsPerMonth: number;
  currencies: string[] | "all";
  pdfInvoice: boolean;
  taxCalendar: boolean;
  reports: boolean;
  csvExport: boolean;
  emailReminders: boolean;
  customCategories: boolean;
  receiptUpload: boolean;
  multiCurrencyDashboard?: boolean;
  exchangeRateHistory?: boolean;
  advancedReports?: boolean;
  prioritySupport?: boolean;
}

export interface Plan {
  id: PlanTier;
  nameKey: string;
  price: {
    monthly: { tr: number; en: number };
    yearly: { tr: number; en: number };
  };
  features: PlanLimits;
  variants: {
    monthly: { tr: string; en: string };
    yearly: { tr: string; en: string };
  };
}

export const PLANS: Record<PlanTier, Plan> = {
  free: {
    id: "free",
    nameKey: "pricing.plans.free",
    price: {
      monthly: { tr: 0, en: 0 },
      yearly: { tr: 0, en: 0 },
    },
    variants: {
      monthly: { tr: "", en: "" },
      yearly: { tr: "", en: "" },
    },
    features: {
      maxProjects: 2,
      maxClients: 3,
      maxInvoicesPerMonth: 3,
      maxTransactionsPerMonth: 30,
      currencies: ["TRY"],
      pdfInvoice: true,
      taxCalendar: true,
      reports: false,
      csvExport: false,
      emailReminders: false,
      customCategories: false,
      receiptUpload: false,
    },
  },
  basic: {
    id: "basic",
    nameKey: "pricing.plans.basic",
    price: {
      monthly: { tr: 249, en: 14 },
      yearly: { tr: 2390, en: 134 },
    },
    variants: {
      monthly: {
        tr: process.env.NEXT_PUBLIC_LS_BASIC_MONTHLY_TR ?? "",
        en: process.env.NEXT_PUBLIC_LS_BASIC_MONTHLY_EN ?? "",
      },
      yearly: {
        tr: process.env.NEXT_PUBLIC_LS_BASIC_YEARLY_TR ?? "",
        en: process.env.NEXT_PUBLIC_LS_BASIC_YEARLY_EN ?? "",
      },
    },
    features: {
      maxProjects: 10,
      maxClients: 20,
      maxInvoicesPerMonth: 20,
      maxTransactionsPerMonth: 500,
      currencies: ["TRY", "USD", "EUR"],
      pdfInvoice: true,
      taxCalendar: true,
      reports: false,
      csvExport: true,
      emailReminders: true,
      customCategories: true,
      receiptUpload: true,
    },
  },
  pro: {
    id: "pro",
    nameKey: "pricing.plans.pro",
    price: {
      monthly: { tr: 699, en: 39 },
      yearly: { tr: 6710, en: 374 },
    },
    variants: {
      monthly: {
        tr: process.env.NEXT_PUBLIC_LS_PRO_MONTHLY_TR ?? "",
        en: process.env.NEXT_PUBLIC_LS_PRO_MONTHLY_EN ?? "",
      },
      yearly: {
        tr: process.env.NEXT_PUBLIC_LS_PRO_YEARLY_TR ?? "",
        en: process.env.NEXT_PUBLIC_LS_PRO_YEARLY_EN ?? "",
      },
    },
    features: {
      maxProjects: Number.POSITIVE_INFINITY,
      maxClients: Number.POSITIVE_INFINITY,
      maxInvoicesPerMonth: Number.POSITIVE_INFINITY,
      maxTransactionsPerMonth: Number.POSITIVE_INFINITY,
      currencies: "all",
      pdfInvoice: true,
      taxCalendar: true,
      reports: true,
      csvExport: true,
      emailReminders: true,
      customCategories: true,
      receiptUpload: true,
      multiCurrencyDashboard: true,
      exchangeRateHistory: true,
      advancedReports: true,
      prioritySupport: true,
    },
  },
};

export function planFeatures(plan: PlanTier): PlanLimits {
  return PLANS[plan].features;
}

export function canAccess(plan: PlanTier, feature: keyof PlanLimits): boolean {
  const f = planFeatures(plan);
  const v = f[feature];
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v > 0;
  return Array.isArray(v) || v === "all";
}
