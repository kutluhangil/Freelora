const API = "https://api.lemonsqueezy.com/v1";

export function buildCheckoutUrl(opts: {
  storeId: string;
  variantId: string;
  userId: string;
  locale: "tr" | "en";
  email?: string;
}) {
  const params = new URLSearchParams({
    "checkout[custom][user_id]": opts.userId,
    "checkout[custom][locale]": opts.locale,
  });
  if (opts.email) params.set("checkout[email]", opts.email);
  return `https://${opts.storeId}.lemonsqueezy.com/checkout/buy/${opts.variantId}?${params.toString()}`;
}

export async function lsFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`LS ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}
