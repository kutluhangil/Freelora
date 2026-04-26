# Freelora — Geliştirme Checkpoint

Bu dosya, projede yapılan tüm önemli kararları, düzeltilen kritik hataları ve eklenen özellikleri kayıt altına alır. İleride devam edilirken bağlam kurmak için kullanılır.

---

## Proje Hakkında

- **İsim:** Freelora
- **Amaç:** Freelancerlar için SaaS finans yönetim uygulaması
- **Repo:** https://github.com/kutluhangil/Freelora
- **Deploy:** Vercel (production), Docker desteği de mevcut
- **Stack:** Next.js 14 App Router · TypeScript strict · Tailwind CSS 3.4 · Supabase 2.47.10 · Framer Motion 11

---

## Kritik Teknik Kararlar

### 1. Supabase sürümü exact pin edilmeli
`@supabase/supabase-js: "2.47.10"` ve `@supabase/ssr: "0.5.2"` exact sürüm olarak sabitlendi.
- **Neden:** `^2.47.10` npm semver'i `2.104.1`'e resolve etti. Bu sürüm yeni `PostgrestVersion: "12"` tip sistemi kullanıyor, `Database['public']` artık `GenericSchema`'yı karşılamıyor, tüm table tipleri `never` oluyor.
- **Çözüm:** `package.json`'da `^` kaldırıldı, exact version yazıldı.

### 2. next.config.ts → next.config.mjs
Next.js 14.2.x `.ts` config dosyasını desteklemiyor.
- **Çözüm:** `next.config.mjs` olarak yeniden adlandırıldı, ESM syntax'a çevrildi.

### 3. Resend lazy init (Proxy pattern)
`new Resend(process.env.RESEND_API_KEY)` build sırasında çalışınca `Missing API key` hatası veriyor.
- **Çözüm:** `src/lib/email/resend.ts` — JavaScript `Proxy` ile lazy initialization. İlk method çağrısında client oluşturulur.

### 4. output: "standalone" Vercel'de kaldırıldı
Docker deploy için eklenmişti, Vercel için gerekmiyor ve build sorununa yol açabilir.
- **Çözüm:** `next.config.mjs`'den kaldırıldı.

### 5. /api/exchange-rates → force-dynamic
Statik pre-render sırasında `supabaseUrl is required` hatası alındı.
- **Çözüm:** `export const dynamic = "force-dynamic"` eklendi.

### 6. GitHub Actions SSH deploy kaldırıldı
`appleboy/ssh-action` `missing server host` hatası veriyordu çünkü SSH_HOST secret tanımlı değildi. Vercel kendi deployment'ı yönetiyor.
- **Çözüm:** `.github/workflows/deploy.yml` sadece lint + type-check CI'ya dönüştürüldü.

### 7. Database generic tip yapısı
Supabase `createClient<Database>()` için `Database['public']` tipi özel yapı gerektiriyor:
```ts
type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: never[];  // boş dizi değil, never[] olmalı
};
// Views: Record<string, never>  — boş obje değil
```

---

## Yapılan Tüm Özellikler

### Temel MVP (ilk sürüm)
- [x] Supabase Auth (email/password + Google OAuth)
- [x] Dashboard — gelir özeti, proje kârlılık grafiği, döviz widget, son işlemler, yaklaşan vergiler
- [x] Gelir / Gider takibi (kategoriler, tekrarlayan işlemler, çoklu para birimi)
- [x] Fatura yönetimi — PDF oluşturma (`@react-pdf/renderer`), durum takibi, e-posta gönderimi (Resend)
- [x] Müşteri yönetimi — profil, gelir toplamı, açık faturalar
- [x] Proje takibi — bütçe, saatlik ücret, kârlılık
- [x] Vergi takvimi — TR/US/DE tarihleri, `seedTaxRemindersFromCountry()`, e-posta hatırlatmaları
- [x] Döviz kurları — günlük cron ile güncelleme (`exchangerate-api.com`)
- [x] Abonelik — Lemon Squeezy entegrasyonu, webhook handler, plan gate
- [x] CSV export — BOM destekli Excel uyumlu
- [x] Çoklu dil — Türkçe (varsayılan) + İngilizce (`next-intl`)
- [x] SEO — `robots.ts`, `sitemap.ts`, locale-aware `generateMetadata`, OG meta
- [x] Onboarding — 4 adımlı modal sihirbazı, ülke bazlı vergi seeding
- [x] Fiş yükleme — Supabase Storage, `receipts/{user_id}/` RLS korumalı
- [x] Command palette — `⌘K` / `Ctrl+K` (`cmdk`)
- [x] Docker + nginx + certbot + cron multi-service compose
- [x] GitHub Actions CI/CD (SSH-based, sonradan Vercel CI'ya dönüştürüldü)

### Ek Özellikler (ikinci tur)
- [x] **Zaman Takibi** — start/stop timer, proje bazlı, saatlik ücret, faturalandırma takibi
- [x] **Teklif (Proposal) Modülü** — oluştur/düzenle/gönder/kabul, public link, faturaya dönüştür
- [x] **Müşteri Portalı** — `portal_token` ile müşteriler kendi faturalarını görür (auth gerekmez)
- [x] **Gecikmiş Fatura Hatırlatması** — günlük cron, müşteriye otomatik e-posta, `overdue_reminder_sent_at` takibi
- [x] **Gelişmiş Raporlar** — aylık bar chart (son 12 ay), kategori breakdown, yıl özeti stat kartları

### Olmazsa Olmaz Özellikler (üçüncü tur)
- [x] **Tekrarlayan Fatura Otomasyonu** — şablon oluştur, günlük cron her gün kontrol eder, aylık/3 aylık/yıllık olarak otomatik draft fatura üretir
- [x] **Uygulama İçi Bildirim Merkezi** — bell icon Topbar'da, unread badge, dropdown liste, okundu işaretleme, notification type'a göre ikon
- [x] **Vergi Rezervi Hesaplayıcı** — TR gelir vergisi kademeli dilimlerine göre YTD gelir üzerinden tahmini vergi hesabı, dashboard widget

---

## Veritabanı Migration Sırası

| # | Dosya | İçerik |
|---|-------|--------|
| 001 | `001_initial_schema.sql` | Tüm core tablolar ve indexler |
| 002 | `002_rls_policies.sql` | Row Level Security politikaları |
| 003 | `003_functions.sql` | PostgreSQL fonksiyonları (`get_revenue_trend`, `next_invoice_number`...) |
| 004 | `004_triggers.sql` | `updated_at` trigger'ı ve diğerleri |
| 005 | `005_seed.sql` | Başlangıç döviz kurları |
| 006 | `006_onboarding.sql` | `profiles.onboarded` kolonu |
| 007 | `007_storage.sql` | `receipts` storage bucket + RLS |
| 008 | `008_time_entries.sql` | `time_entries` tablosu |
| 009 | `009_proposals.sql` | `proposals` tablosu + `public_token` |
| 010 | `010_client_portal.sql` | `clients.portal_token` kolonu |
| 011 | `011_overdue_reminders.sql` | `invoices.overdue_reminder_sent_at` kolonu |
| 012 | `012_notifications.sql` | `notifications` tablosu (type, title, message, href, read) |
| 013 | `013_recurring_invoices.sql` | `recurring_invoice_configs` tablosu (items JSONB, interval, day_of_month) |

---

## Cron Job'lar

| Zaman | Route | Görev |
|-------|-------|-------|
| 06:00 UTC | `/api/cron/exchange-sync` | Döviz kurlarını güncelle |
| 08:00 UTC | `/api/cron/tax-reminders` | Vergi hatırlatma e-postaları |
| 09:00 UTC | `/api/cron/overdue-reminders` | Gecikmiş fatura hatırlatma e-postaları |
| 07:00 UTC | `/api/cron/recurring-invoices` | Aktif şablonlardan otomatik draft fatura üretimi + bildirim |

Tüm cron'lar `Authorization: Bearer CRON_SECRET` header ile korunur.
Vercel `CRON_SECRET`'ı otomatik oluşturur ve cron isteklerine ekler.

---

## Dosya Yapısı — Önemli Yerler

```
src/
├── lib/
│   ├── actions/
│   │   ├── invoices.ts          # createInvoice, updateInvoiceStatus, deleteInvoice
│   │   ├── transactions.ts      # createTransaction, updateTransaction, deleteTransaction
│   │   ├── projects.ts          # CRUD
│   │   ├── clients.ts           # CRUD
│   │   ├── tax-reminders.ts     # CRUD + seedTaxRemindersFromCountry()
│   │   ├── time-entries.ts          # startTimer, stopTimer, toggleBilled
│   │   ├── proposals.ts             # CRUD + convertProposalToInvoice + acceptProposalByToken
│   │   ├── recurring-invoices.ts    # createRecurringConfig, updateRecurringConfig, deleteRecurringConfig
│   │   └── notifications.ts         # createNotificationForUser, markNotificationRead, markAllNotificationsRead
│   ├── email/
│   │   ├── resend.ts            # Proxy-based lazy init
│   │   └── templates.ts         # taxReminderHtml, invoiceEmailHtml, overdueInvoiceHtml
│   ├── supabase/
│   │   ├── admin.ts             # Service role client (server-only)
│   │   ├── server.ts            # Server Component client
│   │   ├── client.ts            # Browser client
│   │   └── middleware.ts        # Session refresh middleware
│   └── utils/
│       ├── csv.ts               # toCSV + downloadCSV (BOM destekli)
│       └── currency.ts          # formatCurrency
├── app/
│   ├── api/
│   │   ├── cron/
│   │   │   ├── exchange-sync/       # Döviz güncelleme
│   │   │   ├── tax-reminders/       # Vergi e-postası
│   │   │   ├── overdue-reminders/   # Gecikmiş fatura e-postası
│   │   │   └── recurring-invoices/  # Otomatik fatura üretimi
│   │   ├── invoices/
│   │   │   ├── generate-pdf/    # PDF stream
│   │   │   └── send-email/      # Fatura e-postası
│   │   └── webhooks/
│   │       └── lemon-squeezy/   # Ödeme webhook
│   └── [locale]/
│       ├── p/[token]/           # Public teklif görüntüleme (auth gerektirmez)
│       └── portal/[token]/      # Müşteri portalı (auth gerektirmez)
└── types/
    └── database.ts              # Tüm DB tipleri + Database generic
```

---

## Deployment Notları

### Vercel (aktif)
- `vercel.json` ile 4 cron job tanımlı
- `output: "standalone"` kaldırıldı (Docker'a özeldi)
- `CRON_SECRET` Vercel tarafından otomatik yönetiliyor

### Docker (alternatif)
- `docker/docker-compose.yml` — app + nginx + certbot + cron
- `docker/Dockerfile` — multi-stage Node.js 20 Alpine
- `docker/nginx/default.conf` — reverse proxy + SSL

### CI
- `.github/workflows/deploy.yml` — lint + type-check (Vercel deploy otomatik)

---

## Bilinen Sınırlamalar / Gelecek İyileştirmeler

- [ ] Raporlar PDF export — şu an sadece CSV var
- [ ] Zaman takibinden otomatik fatura oluşturma (oluşturulan zaman kayıtlarından)
- [ ] Teklif PDF export
- [ ] Müşteri portalında ödeme linki entegrasyonu
- [ ] Çoklu kullanıcı / ekip desteği
- [ ] Banka entegrasyonu
- [ ] Mobil uygulama (React Native)
