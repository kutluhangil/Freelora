import { createClient } from "@/lib/supabase/server";
import { PLANS, type PlanLimits, type PlanTier } from "@/lib/constants/plans";

export async function getCurrentPlan(): Promise<PlanTier> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "free";
  const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
  return ((data?.plan as PlanTier | undefined) ?? "free") as PlanTier;
}

export async function assertWithinPlan(
  feature: keyof PlanLimits,
  countQuery?: () => Promise<number>
): Promise<{ ok: boolean; reason?: string }> {
  const plan = await getCurrentPlan();
  const limits = PLANS[plan].features;
  const v = limits[feature];

  if (typeof v === "boolean") {
    return v ? { ok: true } : { ok: false, reason: `feature.${String(feature)}` };
  }
  if (typeof v === "number") {
    if (v === Number.POSITIVE_INFINITY) return { ok: true };
    if (!countQuery) return { ok: true };
    const cnt = await countQuery();
    return cnt < v ? { ok: true } : { ok: false, reason: `limit.${String(feature)}` };
  }
  return { ok: true };
}
