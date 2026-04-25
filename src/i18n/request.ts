import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, defaultLocale, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (locales as readonly string[]).includes(requested ?? "")
    ? (requested as Locale)
    : defaultLocale;

  let messages;
  try {
    messages = (await import(`../../public/locales/${locale}/common.json`)).default;
  } catch {
    notFound();
  }

  return {
    locale,
    messages,
    timeZone: "Europe/Istanbul",
    now: new Date(),
  };
});
