import { setRequestLocale } from "next-intl/server";
import { LandingNav } from "@/components/landing/LandingNav";
import { PricingCards } from "@/components/landing/PricingCards";
import { Footer } from "@/components/landing/Footer";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "tr" | "en");
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <LandingNav />
      <div className="pt-20">
        <PricingCards />
      </div>
      <Footer />
    </div>
  );
}
