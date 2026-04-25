"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error(t("minPassword"));
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, locale },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      // Insert profile (trigger handles too, but as a safeguard)
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        locale,
        country: locale === "tr" ? "TR" : "US",
        preferred_currency: locale === "tr" ? "TRY" : "USD",
      });
    }
    toast.success(t("registerSuccess"));
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="fullName"
        label={t("fullName")}
        placeholder="Ada Lovelace"
        leading={<User className="h-3.5 w-3.5" />}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        autoComplete="name"
      />
      <Input
        type="email"
        name="email"
        label={t("email")}
        placeholder="you@example.com"
        leading={<Mail className="h-3.5 w-3.5" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        name="password"
        label={t("password")}
        hint={t("minPassword")}
        leading={<Lock className="h-3.5 w-3.5" />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
        autoComplete="new-password"
      />
      <Button type="submit" loading={loading} className="w-full" size="lg">
        {t("signUp")}
      </Button>
      <p className="pt-2 text-center text-xs text-text-tertiary">
        {t("haveAccount")}{" "}
        <Link href="/login" className="text-accent hover:text-accent-hover transition-colors">
          {t("signIn")}
        </Link>
      </p>
    </form>
  );
}
