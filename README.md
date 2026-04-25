<div align="center">

```
███████╗██████╗ ███████╗███████╗██╗      ██████╗ ██████╗  █████╗
██╔════╝██╔══██╗██╔════╝██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗
█████╗  ██████╔╝█████╗  █████╗  ██║     ██║   ██║██████╔╝███████║
██╔══╝  ██╔══██╗██╔══╝  ██╔══╝  ██║     ██║   ██║██╔══██╗██╔══██║
██║     ██║  ██║███████╗███████╗███████╗╚██████╔╝██║  ██║██║  ██║
╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
```

### One Dashboard. Every Invoice.

*Freelance finans yönetimini basit, hızlı ve güzel hale getiren uygulama.*

---

[![Version](https://img.shields.io/badge/version-0.1.0-C8FF00?style=flat-square&labelColor=0A0A0B)](https://github.com/kutluhangil/Freelora)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=0A0A0B)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-white?style=flat-square&logo=next.js&logoColor=white&labelColor=0A0A0B)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0A0A0B)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white&labelColor=0A0A0B)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=flat-square&logo=framer&logoColor=white&labelColor=0A0A0B)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/license-MIT-C8FF00?style=flat-square&labelColor=0A0A0B)](LICENSE)

---

[**Uygulamaya Git**](https://freelora.app) · [**Hata Bildir**](https://github.com/kutluhangil/Freelora/issues) · [**Özellik İste**](https://github.com/kutluhangil/Freelora/issues/new)

</div>

---

## Freelora Nedir?

<details>
<summary><strong>Türkçe Açıklama</strong></summary>
<br>

Freelora, serbest çalışanlar ve küçük işletmeler için tasarlanmış kapsamlı bir finans yönetim platformudur. Fatura oluşturmaktan gelir/gider takibine, vergi takviminden döviz kuru takibine kadar ihtiyacınız olan her şeyi tek bir karanlık ekranda sunar.

**Neden Freelora?**
- Muhasebeci olmadan vergi takvimini takip et
- Otomatik oluşturulan PDF faturalar ile müşterilere profesyonel görün
- Çoklu para birimi desteğiyle uluslararası işleri yönet
- Türkçe/İngilizce arayüz seçeneğiyle rahat çalış

</details>

Freelora is a **full-stack SaaS** for freelancers and small businesses. It handles invoicing, income/expense tracking, tax reminders, multi-currency conversion, project management, and more — all wrapped in a dark, focused UI.

---

## Özellikler

| # | Özellik | Açıklama |
|---|---------|----------|
| 🧾 | **Fatura Yönetimi** | PDF oluşturma, e-posta gönderimi, durum takibi (taslak/gönderildi/ödendi) |
| 💰 | **Gelir & Gider** | Kategorize edilmiş işlem takibi, tekrarlayan işlemler, fiş yükleme |
| 📊 | **Dashboard** | Gerçek zamanlı gelir özeti, proje karlılık grafiği, döviz widget |
| 👥 | **Müşteri Yönetimi** | Müşteri profilleri, fatura geçmişi, detay sayfaları |
| 📁 | **Proje Takibi** | Proje bazlı karlılık, bütçe vs. gerçek karşılaştırması |
| 🗓️ | **Vergi Takvimi** | TR/US/DE vergi tarihleri, e-posta hatırlatmaları (7/3/1 gün önce) |
| 💱 | **Döviz Kurları** | Günlük otomatik güncelleme, USD bazlı çoklu para birimi desteği |
| 📤 | **CSV Export** | Excel uyumlu BOM destekli dışa aktarım |
| ⌨️ | **Command Palette** | `Ctrl+K` / `⌘K` ile hızlı navigasyon |
| 🌍 | **Çoklu Dil** | Türkçe (varsayılan) ve İngilizce arayüz |
| 🔐 | **Auth** | Supabase Auth, Google OAuth, şifre sıfırlama |
| 📱 | **Responsive** | Masaüstü + mobil uyumlu tasarım |
| 🚀 | **Onboarding** | 4 adımlı kurulum sihirbazı, ülke bazlı vergi seeding |
| 📧 | **E-posta** | Resend ile transactional e-postalar, özelleştirilmiş HTML şablonları |

---

## Ekran Görüntüleri

> `public/og.png` oluşturulduktan sonra buraya gerçek ekran görüntüleri eklenecek.

| Dashboard | Faturalar | Projeler |
|-----------|-----------|----------|
| *(yakında)* | *(yakında)* | *(yakında)* |

---

## Teknoloji Yığını

```
Frontend
├── Next.js 14 (App Router, Server Components, Server Actions)
├── TypeScript 5 (strict mode)
├── Tailwind CSS 3.4 (CSS custom properties / design tokens)
├── Framer Motion 11 (page transitions, AnimatePresence, spring)
├── Recharts 2 (revenue & profit charts)
├── @react-pdf/renderer 4 (client-side invoice PDF generation)
├── next-intl 3 (i18n — TR/EN, locale-aware routing)
├── cmdk 1 (command palette)
└── Zustand (client-side state)

Backend & Data
├── Supabase 2.47.10
│   ├── PostgreSQL (RLS, triggers, functions, views)
│   ├── Supabase Auth (email + Google OAuth)
│   └── Supabase Storage (receipt uploads, images/PDF)
├── Next.js API Routes (cron endpoints, webhooks)
└── node-cron (scheduled jobs via standalone script)

Services
├── Lemon Squeezy (subscriptions & payments)
├── Resend (transactional email)
└── exchangerate-api.com (daily currency sync)

Infrastructure
├── Docker + Docker Compose (multi-service: app, nginx, certbot, cron)
├── GitHub Actions (SSH-based CI/CD to self-hosted server)
└── Let's Encrypt / Certbot (automatic SSL)
```

---

## Mimari

```
┌─────────────────────────────────────────────────────────┐
│                       Internet                          │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│                  Nginx (reverse proxy)                  │
│              Let's Encrypt SSL termination              │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│               Next.js 14 Application                    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Landing   │  │  Dashboard  │  │   API Routes    │ │
│  │  /[locale]  │  │ (protected) │  │  /api/...       │ │
│  └─────────────┘  └─────────────┘  └────────┬────────┘ │
│                                              │          │
│  ┌─────────────────────────────────────────┐│          │
│  │         Server Actions (mutations)      ││          │
│  └─────────────────────────────────────────┘│          │
└─────────────────────────────────┬────────────┴──────────┘
                                  │
          ┌───────────────────────┼───────────────────┐
          │                       │                   │
┌─────────▼────────┐   ┌──────────▼──────┐  ┌────────▼──────┐
│    Supabase       │   │  Lemon Squeezy  │  │    Resend     │
│  ┌─────────────┐  │   │  (payments &    │  │  (email       │
│  │ PostgreSQL  │  │   │  subscriptions) │  │  delivery)    │
│  │ + RLS + Auth│  │   └─────────────────┘  └───────────────┘
│  ├─────────────┤  │
│  │   Storage   │  │   ┌─────────────────────────────────────┐
│  │  (receipts) │  │   │      node-cron (Cron Container)     │
│  └─────────────┘  │   │  • 06:00 exchange sync              │
└────────────────────┘   │  • 08:00 tax reminders email       │
                         │  • 09:00 overdue invoice alerts     │
                         │  • 1st of month: recurring txns     │
                         └─────────────────────────────────────┘
```

---

## Proje Yapısı

```
Freelora/
├── docker/
│   ├── Dockerfile                    # Multi-stage Node.js 20 Alpine build
│   ├── docker-compose.yml            # app + nginx + certbot + cron services
│   └── nginx/
│       └── default.conf              # Reverse proxy + SSL config
│
├── scripts/
│   └── cron.ts                       # Standalone cron runner (node-cron)
│
├── supabase/
│   ├── config.toml
│   └── migrations/
│       ├── 001_initial_schema.sql    # Tablolar ve indexler
│       ├── 002_rls_policies.sql      # Row Level Security politikaları
│       ├── 003_functions.sql         # PostgreSQL fonksiyonları
│       ├── 004_triggers.sql          # Tetikleyiciler (updated_at vb.)
│       ├── 005_seed.sql              # Başlangıç döviz kurları
│       ├── 006_onboarding.sql        # onboarded kolonu
│       └── 007_storage.sql           # Receipts storage bucket
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/               # Giriş/Kayıt/Şifre sıfırlama
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── forgot-password/
│   │   │   ├── (dashboard)/          # Korumalı uygulama sayfaları
│   │   │   │   ├── dashboard/
│   │   │   │   ├── invoices/         # Liste + detay + yeni
│   │   │   │   ├── income/
│   │   │   │   ├── expenses/
│   │   │   │   ├── projects/         # Liste + detay
│   │   │   │   ├── clients/          # Liste + detay
│   │   │   │   ├── calendar/         # Vergi takvimi
│   │   │   │   ├── currency/         # Döviz kuru tablosu
│   │   │   │   ├── reports/
│   │   │   │   └── settings/         # Profil + fatura + abonelik
│   │   │   ├── pricing/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Locale-aware metadata
│   │   │   ├── not-found.tsx
│   │   │   ├── error.tsx
│   │   │   └── loading.tsx
│   │   ├── api/
│   │   │   ├── auth/callback/        # Supabase OAuth callback
│   │   │   ├── cron/
│   │   │   │   ├── exchange-sync/    # Günlük döviz güncelleme
│   │   │   │   └── tax-reminders/    # E-posta hatırlatma
│   │   │   ├── invoices/
│   │   │   │   ├── generate-pdf/     # PDF stream
│   │   │   │   └── send-email/       # E-posta ile fatura
│   │   │   ├── exchange-rates/       # Public döviz kuru endpoint
│   │   │   └── webhooks/
│   │   │       └── lemon-squeezy/    # Ödeme webhook
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── globals.css               # Tailwind + design token tanımları
│   │   └── layout.tsx                # Root layout (font, Toaster)
│   │
│   ├── components/
│   │   ├── auth/                     # Login/Register/ForgotPassword formları
│   │   ├── calendar/                 # CalendarHeader, ReminderCard
│   │   ├── clients/                  # ClientForm, ClientsTable
│   │   ├── dashboard/                # StatCard, RevenueChart, CurrencyWidget...
│   │   ├── invoices/                 # InvoiceForm, InvoiceActions
│   │   ├── landing/                  # Hero, Features, PricingCards, Testimonials
│   │   ├── layout/                   # Sidebar, Topbar, MobileNav, CommandPalette
│   │   ├── onboarding/               # OnboardingModal (4-step wizard)
│   │   ├── projects/                 # ProjectCard, ProjectForm
│   │   ├── settings/                 # ProfileForm
│   │   ├── shared/                   # LanguageSwitcher
│   │   ├── transactions/             # TransactionForm, TransactionList,
│   │   │                             #   ExportCSVButton, ReceiptUpload
│   │   └── ui/                       # Button, Input, Select, Modal, Drawer,
│   │                                 #   Badge, Card, Table, Tabs, Tooltip...
│   │
│   ├── i18n/
│   │   ├── config.ts                 # Lokaller: ['tr', 'en']
│   │   ├── navigation.ts             # Lokalize Link/useRouter
│   │   └── request.ts                # next-intl sunucu entegrasyonu
│   │
│   ├── lib/
│   │   ├── actions/                  # Server Actions (CRUD)
│   │   │   ├── clients.ts
│   │   │   ├── invoices.ts
│   │   │   ├── projects.ts
│   │   │   ├── tax-reminders.ts
│   │   │   └── transactions.ts
│   │   ├── constants/
│   │   │   ├── categories.ts         # Gelir/gider kategori listesi
│   │   │   ├── currencies.ts         # Para birimi meta verileri
│   │   │   ├── plans.ts              # Plan limitleri
│   │   │   └── tax-dates.ts          # TR/US/DE vergi tarihleri
│   │   ├── email/
│   │   │   ├── resend.ts             # Lazy-init Resend istemcisi
│   │   │   └── templates.ts          # HTML e-posta şablonları
│   │   ├── lemon-squeezy/
│   │   │   └── client.ts             # Checkout URL oluşturucu
│   │   ├── pdf/
│   │   │   └── invoice-template.tsx  # @react-pdf/renderer şablonu
│   │   ├── queries/
│   │   │   └── dashboard.ts          # Dashboard veri sorguları
│   │   ├── supabase/
│   │   │   ├── admin.ts              # Service role istemcisi
│   │   │   ├── client.ts             # Browser istemcisi
│   │   │   ├── middleware.ts         # Session yenileme middleware
│   │   │   └── server.ts             # Server Component istemcisi
│   │   └── utils/
│   │       ├── cn.ts                 # clsx + tailwind-merge
│   │       ├── csv.ts                # toCSV + downloadCSV
│   │       ├── currency.ts           # Para birimi formatlama
│   │       ├── date.ts               # Tarih yardımcıları
│   │       └── validation.ts
│   │
│   └── types/
│       └── database.ts               # Supabase tablo tip tanımları
│
├── public/
│   ├── fonts/
│   ├── icons/
│   └── locales/
│       ├── tr/common.json
│       └── en/common.json
│
├── .env.example
├── .env.local                        # (git'e eklenmez)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── SETUP_GUIDE.md                    # Harici servis kurulum kılavuzu
└── README.md
```

---

## Başlarken

### Gereksinimler

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Supabase** hesabı (ücretsiz)
- **Resend** hesabı (e-posta için)
- **Lemon Squeezy** hesabı (ödeme için, isteğe bağlı)

### Yerel Geliştirme

```bash
# Repoyu klonla
git clone https://github.com/kutluhangil/Freelora.git
cd Freelora

# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env.local
# .env.local dosyasını düzenle (aşağıdaki tabloya bak)

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır. Varsayılan dil Türkçe (`/tr`), İngilizce için `/en` kullan.

### Veritabanı Kurulumu

Supabase SQL Editor'de migration dosyalarını sırayla çalıştır:

```bash
supabase/migrations/001_initial_schema.sql   # Tablolar
supabase/migrations/002_rls_policies.sql     # RLS güvenlik politikaları
supabase/migrations/003_functions.sql        # PostgreSQL fonksiyonları
supabase/migrations/004_triggers.sql         # Tetikleyiciler
supabase/migrations/005_seed.sql             # Başlangıç döviz kurları
supabase/migrations/006_onboarding.sql       # Onboarding kolonu
supabase/migrations/007_storage.sql          # Fiş yükleme storage bucket'ı
```

Detaylı talimatlar için [SETUP_GUIDE.md](SETUP_GUIDE.md) dosyasına bak.

### Scriptler

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (`http://localhost:3000`) |
| `npm run build` | Production build |
| `npm run start` | Production sunucusu |
| `npm run lint` | ESLint kontrolü |
| `npx ts-node scripts/cron.ts` | Cron job'larını manuel başlat |

---

## Ortam Değişkenleri

`.env.local` dosyasına eklenecek değişkenler:

| Değişken | Açıklama | Zorunlu |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonim anahtar | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase servis rol anahtarı | ✅ |
| `NEXT_PUBLIC_APP_URL` | Uygulamanın public URL'i | ✅ |
| `RESEND_API_KEY` | Resend API anahtarı | ✅ |
| `RESEND_FROM_EMAIL` | Gönderici e-posta adresi | ✅ |
| `LEMON_SQUEEZY_API_KEY` | Lemon Squeezy API anahtarı | ✅ |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Webhook imzalama anahtarı | ✅ |
| `NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID` | Store ID | ✅ |
| `NEXT_PUBLIC_LS_BASIC_MONTHLY` | Basic Aylık varyant ID | ✅ |
| `NEXT_PUBLIC_LS_BASIC_YEARLY` | Basic Yıllık varyant ID | ✅ |
| `NEXT_PUBLIC_LS_PRO_MONTHLY` | Pro Aylık varyant ID | ✅ |
| `NEXT_PUBLIC_LS_PRO_YEARLY` | Pro Yıllık varyant ID | ✅ |
| `EXCHANGE_RATE_API_KEY` | exchangerate-api.com anahtarı | ✅ |
| `CRON_SECRET` | Cron endpoint güvenlik anahtarı | ✅ |

---

## Güvenlik & Veri Gizliliği

| Katman | Yöntem |
|--------|--------|
| **Kimlik Doğrulama** | Supabase Auth — email/password + Google OAuth |
| **Yetkilendirme** | PostgreSQL Row Level Security (RLS) — her kullanıcı yalnızca kendi verisini görür |
| **API Koruması** | Server Actions sunucu tarafında session doğrular |
| **Cron Güvenliği** | `Authorization: Bearer <CRON_SECRET>` header zorunluluğu |
| **Webhook Güvenliği** | Lemon Squeezy HMAC imza doğrulaması |
| **Depolama** | Supabase Storage RLS — dosyalar `receipts/{user_id}/` klasörüyle kısıtlı |
| **Şifreleme** | Supabase managed PostgreSQL — AES-256 at rest |
| **HTTPS** | Nginx + Let's Encrypt SSL (production) |

---

## Abonelik Planları

| Özellik | Ücretsiz | Basic | Pro |
|---------|----------|-------|-----|
| Fatura | 5/ay | 50/ay | Sınırsız |
| Müşteri | 3 | 25 | Sınırsız |
| Proje | 3 | 25 | Sınırsız |
| İşlem | 50/ay | 500/ay | Sınırsız |
| CSV Export | ✅ | ✅ | ✅ |
| Fiş yükleme | ❌ | ✅ | ✅ |
| Fatura e-postası | ❌ | ✅ | ✅ |
| PDF fatura | ✅ | ✅ | ✅ |
| Vergi takvimi | ✅ | ✅ | ✅ |
| E-posta hatırlatma | ❌ | ✅ | ✅ |
| Döviz kuru | ✅ | ✅ | ✅ |
| **Aylık fiyat** | **₺0** | **₺249** | **₺699** |
| **Yıllık fiyat** | **₺0** | **₺2.390** | **₺6.710** |

---

## Docker ile Deploy

```bash
# Sunucuya bağlan ve klonla
git clone https://github.com/kutluhangil/Freelora.git && cd Freelora

# Environment dosyasını oluştur
cp .env.example .env.production
nano .env.production  # Tüm değerleri doldur

# Nginx config'ini domain'e göre düzenle
nano docker/nginx/default.conf

# SSL sertifikası al (ilk kez)
docker compose -f docker/docker-compose.yml up -d nginx
docker compose -f docker/docker-compose.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email senin@email.com --agree-tos --no-eff-email \
  -d senindomain.com

# Tam stack'i başlat
docker compose -f docker/docker-compose.yml up -d
```

**GitHub Actions CI/CD:** `main` branch'e push yapıldığında otomatik SSH deploy tetiklenir. Repo secrets kurulumu için [SETUP_GUIDE.md](SETUP_GUIDE.md#7-github-actions-cicd) bölümüne bak.

---

## Yol Haritası

### v0.1 — MVP ✅

- [x] Kullanıcı kimlik doğrulama (email + Google OAuth)
- [x] Fatura oluşturma ve PDF export
- [x] Gelir / gider takibi
- [x] Müşteri ve proje yönetimi
- [x] Vergi takvimi (TR/US/DE)
- [x] Döviz kuru widget (günlük güncelleme)
- [x] Dashboard (gelir özeti, proje karlılık grafiği)
- [x] Çoklu dil desteği (TR/EN)
- [x] Abonelik sistemi (Lemon Squeezy)
- [x] CSV export (Excel uyumlu)
- [x] Command palette (`⌘K`)
- [x] Onboarding sihirbazı
- [x] Fiş yükleme (Supabase Storage)
- [x] Transactional e-postalar (Resend)
- [x] SEO (sitemap, robots, OG meta)
- [x] Docker + GitHub Actions CI/CD

### v0.2 — Yakında

- [ ] Raporlar sayfası — PDF/CSV export, gelişmiş grafikler
- [ ] Teklif (Proposal) modülü — fatura öncesi teklif oluşturma
- [ ] Zaman takibi — proje bazlı saat takibi

### v1.0 — Gelecek

- [ ] Müşteri portalı — müşterilerin kendi faturalarını görmesi
- [ ] Banka entegrasyonu — otomatik işlem içe aktarma
- [ ] Mobil uygulama (React Native)
- [ ] Çoklu kullanıcı / ekip desteği

---

## Katkıda Bulunma

1. Bu repoyu fork'la
2. Feature branch oluştur: `git checkout -b feature/yeni-ozellik`
3. Değişikliklerini commit et: `git commit -m 'feat: yeni özellik ekle'`
4. Branch'ini push et: `git push origin feature/yeni-ozellik`
5. Pull Request aç

Lütfen TypeScript strict mode ve ESLint kurallarına uy. Yeni özellikler için TR/EN çeviri anahtarlarını (`public/locales/`) da eklemeyi unutma.

---

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında dağıtılmaktadır.

---

<div align="center">

**Built with precision by [kutluhangil](https://github.com/kutluhangil/Freelora)**

*Freelance hayatını kolaylaştırmak için yapıldı.*

[![GitHub](https://img.shields.io/badge/GitHub-kutluhangil-C8FF00?style=flat-square&logo=github&logoColor=white&labelColor=0A0A0B)](https://github.com/kutluhangil/Freelora)

</div>
