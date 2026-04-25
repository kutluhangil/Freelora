import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { locales, type Locale } from "@/i18n/config";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://freelora.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTR = locale === "tr";

  const title = isTR
    ? "Freelora — Freelance işini kontrol altına al"
    : "Freelora — Take control of your freelance business";
  const description = isTR
    ? "Gelir/gider takibi, PDF fatura, vergi takvimi ve çoklu para birimi. Freelancerlar için minimal ve premium finans paneli."
    : "Income tracking, PDF invoices, tax calendar and multi-currency. The minimal, premium finance dashboard for freelancers.";

  return {
    title,
    description,
    metadataBase: new URL(base),
    alternates: {
      canonical: `${base}/${locale}`,
      languages: { tr: `${base}/tr`, en: `${base}/en` },
    },
    openGraph: {
      title,
      description,
      url: `${base}/${locale}`,
      siteName: "Freelora",
      locale: isTR ? "tr_TR" : "en_US",
      type: "website",
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: "Freelora" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${base}/og.png`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale as Locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-default)",
                color: "var(--color-text-primary)",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
