import { format, formatDistanceToNow, parseISO } from "date-fns";
import { tr, enUS } from "date-fns/locale";

const LOCALES = { tr, en: enUS };

export function formatDate(
  date: string | Date,
  pattern: string = "dd MMM yyyy",
  locale: "tr" | "en" = "tr"
): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: LOCALES[locale] });
}

export function relativeFromNow(date: string | Date, locale: "tr" | "en" = "tr"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: LOCALES[locale] });
}

export function daysBetween(a: string | Date, b: string | Date): number {
  const da = typeof a === "string" ? parseISO(a) : a;
  const db = typeof b === "string" ? parseISO(b) : b;
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}
