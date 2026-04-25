"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard/settings/profile`,
    });
    if (error) toast.error(error.message);
    else toast.success("Sent");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        name="email"
        label={t("email")}
        leading={<Mail className="h-3.5 w-3.5" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} className="w-full" size="lg">
        {t("sendResetLink")}
      </Button>
      <p className="pt-2 text-center text-xs">
        <Link href="/login" className="text-text-tertiary hover:text-accent transition-colors">
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}
