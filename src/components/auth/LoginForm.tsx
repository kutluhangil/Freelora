"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(t("loginError"));
      setLoading(false);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        placeholder="••••••••"
        leading={<Lock className="h-3.5 w-3.5" />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-text-tertiary hover:text-accent transition-colors"
        >
          {t("forgotPassword")}
        </Link>
      </div>
      <Button type="submit" loading={loading} className="w-full" size="lg">
        {t("signIn")}
      </Button>

      <div className="relative my-2 flex items-center">
        <div className="flex-1 border-t border-border-subtle" />
        <span className="px-3 text-[10px] uppercase tracking-wide text-text-muted">{t("or")}</span>
        <div className="flex-1 border-t border-border-subtle" />
      </div>

      <Button type="button" variant="secondary" className="w-full" onClick={handleGoogle}>
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#FFC107"
            d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.3-.1-2.4-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 7.1 29.6 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.5 0 10.5-2.1 14.3-5.5l-6.6-5.4c-2 1.4-4.5 2.4-7.7 2.4-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.6 5.4C42 35.6 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"
          />
        </svg>
        {t("continueWithGoogle")}
      </Button>

      <p className="pt-2 text-center text-xs text-text-tertiary">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-accent hover:text-accent-hover transition-colors">
          {t("signUp")}
        </Link>
      </p>
    </form>
  );
}
