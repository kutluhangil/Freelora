export function taxReminderHtml({
  name,
  title,
  dueDate,
  daysLeft,
  locale,
}: {
  name: string;
  title: string;
  dueDate: string;
  daysLeft: number;
  locale: "tr" | "en";
}): string {
  const isTR = locale === "tr";
  const greeting = isTR ? `Merhaba ${name},` : `Hi ${name},`;
  const body = isTR
    ? `<b>${title}</b> için son tarih <b>${dueDate}</b>. <b>${daysLeft} gün</b> kaldı.`
    : `Your tax reminder <b>${title}</b> is due on <b>${dueDate}</b>. <b>${daysLeft} days</b> remaining.`;
  const cta = isTR ? "Takvimi Görüntüle" : "View Calendar";
  const footer = isTR ? "Bu e-postayı Freelora vergi hatırlatma sistemi gönderdi." : "Sent by Freelora tax reminder system.";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://freelora.app";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#0A0A0B;color:#F5F5F7;padding:40px 20px;max-width:600px;margin:0 auto;">
  <div style="background:#111113;border:1px solid #2A2A2E;border-radius:12px;padding:32px;">
    <p style="font-size:28px;font-weight:800;color:#C8FF00;margin:0 0 24px;">Freelora</p>
    <p style="margin:0 0 16px;">${greeting}</p>
    <p style="margin:0 0 24px;color:#A1A1A6;">${body}</p>
    <a href="${appUrl}/${locale}/calendar"
       style="display:inline-block;background:#C8FF00;color:#0A0A0B;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;">
      ${cta}
    </a>
    <p style="margin:32px 0 0;font-size:12px;color:#6B6B70;">${footer}</p>
  </div>
</body>
</html>`;
}

export function invoiceEmailHtml({
  fromName,
  clientName,
  invoiceNumber,
  total,
  currency,
  dueDate,
  notes,
  locale,
}: {
  fromName: string;
  clientName: string;
  invoiceNumber: string;
  total: number;
  currency: string;
  dueDate: string;
  notes?: string | null;
  locale: "tr" | "en";
}): string {
  const isTR = locale === "tr";
  const subject = isTR
    ? `${fromName} tarafından ${invoiceNumber} numaralı fatura`
    : `Invoice ${invoiceNumber} from ${fromName}`;
  const body = isTR
    ? `<b>${invoiceNumber}</b> numaralı faturanız hazır. Toplam tutar: <b>${total.toFixed(2)} ${currency}</b>. Son ödeme tarihi: <b>${dueDate}</b>.`
    : `Invoice <b>${invoiceNumber}</b> is attached. Total: <b>${total.toFixed(2)} ${currency}</b>. Due date: <b>${dueDate}</b>.`;
  const footer = isTR
    ? `Bu fatura ${fromName} tarafından Freelora üzerinden oluşturulmuştur.`
    : `This invoice was created by ${fromName} via Freelora.`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#0A0A0B;color:#F5F5F7;padding:40px 20px;max-width:600px;margin:0 auto;">
  <div style="background:#111113;border:1px solid #2A2A2E;border-radius:12px;padding:32px;">
    <p style="font-size:28px;font-weight:800;color:#C8FF00;margin:0 0 8px;">Freelora</p>
    <p style="margin:0 0 24px;font-size:18px;font-weight:700;">${subject}</p>
    <p style="margin:0 0 16px;">${isTR ? `Sayın ${clientName},` : `Dear ${clientName},`}</p>
    <p style="margin:0 0 24px;color:#A1A1A6;">${body}</p>
    ${notes ? `<p style="margin:0 0 24px;color:#A1A1A6;font-style:italic;">${notes}</p>` : ""}
    <p style="margin:32px 0 0;font-size:12px;color:#6B6B70;">${footer}</p>
  </div>
</body>
</html>`;
}
