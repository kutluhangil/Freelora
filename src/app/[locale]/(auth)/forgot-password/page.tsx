import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getTranslations } from "next-intl/server";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-secondary/80 p-8 shadow-lg backdrop-blur-md">
      <div className="mb-6 space-y-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          {t("resetPassword")}
        </h1>
        <p className="text-sm text-text-tertiary">{t("resetPasswordSubtitle")}</p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
