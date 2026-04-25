import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LSEvent {
  meta: { event_name: string; custom_data?: { user_id?: string; locale?: string } };
  data: {
    id: string;
    attributes: {
      variant_name?: string;
      status?: string;
      customer_id?: number | string;
    };
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) return new NextResponse("Webhook secret not configured", { status: 500 });
  if (!signature) return new NextResponse("Missing signature", { status: 401 });

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");

  if (
    digest.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(signature, "hex"))
  ) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody) as LSEvent;
  const eventName = event.meta.event_name;
  const userId = event.meta.custom_data?.user_id;
  if (!userId) return NextResponse.json({ error: "user_id missing" }, { status: 400 });

  const supabase = createAdminClient();
  const variantName = event.data.attributes.variant_name ?? "";

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated": {
      const plan = variantName.toLowerCase().includes("pro") ? "pro" : "basic";
      const status = event.data.attributes.status ?? "active";
      await supabase
        .from("profiles")
        .update({
          plan,
          plan_status: status,
          lemon_squeezy_customer_id: event.data.attributes.customer_id?.toString(),
          lemon_squeezy_subscription_id: event.data.id?.toString(),
        })
        .eq("id", userId);
      break;
    }
    case "subscription_cancelled": {
      await supabase
        .from("profiles")
        .update({ plan: "free", plan_status: "canceled" })
        .eq("id", userId);
      break;
    }
    case "subscription_payment_failed": {
      await supabase.from("profiles").update({ plan_status: "past_due" }).eq("id", userId);
      break;
    }
  }

  await supabase.from("subscription_events").insert({
    user_id: userId,
    event_type: eventName,
    plan: variantName,
    lemon_squeezy_event_id: event.data.id?.toString(),
    metadata: event.data.attributes as never,
  });

  return NextResponse.json({ ok: true });
}
