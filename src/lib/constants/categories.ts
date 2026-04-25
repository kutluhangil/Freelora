export interface Category {
  id: string;
  type: "income" | "expense";
  labelKey: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  // Income
  { id: "freelance_income", type: "income", labelKey: "categories.freelance_income", emoji: "💼" },
  { id: "consulting", type: "income", labelKey: "categories.consulting", emoji: "🧭" },
  { id: "passive_income", type: "income", labelKey: "categories.passive_income", emoji: "🪙" },
  { id: "other_income", type: "income", labelKey: "categories.other_income", emoji: "✨" },
  // Expense
  { id: "subscription", type: "expense", labelKey: "categories.subscription", emoji: "📦" },
  { id: "hardware", type: "expense", labelKey: "categories.hardware", emoji: "🖥️" },
  { id: "office", type: "expense", labelKey: "categories.office", emoji: "🪑" },
  { id: "travel", type: "expense", labelKey: "categories.travel", emoji: "✈️" },
  { id: "education", type: "expense", labelKey: "categories.education", emoji: "📚" },
  { id: "tax", type: "expense", labelKey: "categories.tax", emoji: "🧾" },
  { id: "accountant", type: "expense", labelKey: "categories.accountant", emoji: "📊" },
  { id: "marketing", type: "expense", labelKey: "categories.marketing", emoji: "📣" },
  { id: "other_expense", type: "expense", labelKey: "categories.other_expense", emoji: "💸" },
];

export function categoriesByType(type: "income" | "expense"): Category[] {
  return CATEGORIES.filter((c) => c.type === type);
}

export function findCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
