import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://freelora.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/tr/", "/en/", "/tr/pricing", "/en/pricing"],
        disallow: [
          "/tr/dashboard",
          "/en/dashboard",
          "/tr/income",
          "/en/income",
          "/tr/expenses",
          "/en/expenses",
          "/tr/invoices",
          "/en/invoices",
          "/tr/projects",
          "/en/projects",
          "/tr/clients",
          "/en/clients",
          "/tr/calendar",
          "/en/calendar",
          "/tr/reports",
          "/en/reports",
          "/tr/settings",
          "/en/settings",
          "/api/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
