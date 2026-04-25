import { setRequestLocale } from "next-intl/server";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { PricingCards } from "@/components/landing/PricingCards";
import { Footer } from "@/components/landing/Footer";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "tr" | "en");
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <LandingNav />
      <Hero />
      <Features />
      <Testimonials />
      <PricingCards />
      <Footer />
    </div>
  );
}
