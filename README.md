# Freelora

> "Freelance işini kontrol altına al." · "Take control of your freelance business."

Freelancerlar için özel tasarlanmış premium finans yönetim uygulaması. Gelir/gider takibi, proje kârlılığı, PDF fatura üretimi, vergi takvimi ve çoklu para birimi desteği — tek bir minimal panelde.

## Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (App Router, Server Components) |
| Auth & DB | Supabase (PostgreSQL + RLS) |
| Stil | Tailwind CSS 3.4 + CSS değişkenleri |
| i18n | next-intl (TR/EN, varsayılan: Türkçe) |
| Ödeme | Lemon Squeezy |
| PDF | @react-pdf/renderer |
| Grafikler | Recharts |
| Animasyon | Framer Motion |

## Hızlı Başlangıç

### 1. Kopyala ve yükle

```bash
git clone https://github.com/kutluhangil/Freelora.git
cd Freelora
npm install
```

### 2. Ortam değişkenleri

```bash
cp .env.example .env.local
```

`.env.local` dosyasını doldur:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID=123456
LEMON_SQUEEZY_API_KEY=your-api-key
LEMON_SQUEEZY_WEBHOOK_SECRET=your-webhook-secret

NEXT_PUBLIC_LS_BASIC_MONTHLY=111111
NEXT_PUBLIC_LS_BASIC_YEARLY=222222
NEXT_PUBLIC_LS_PRO_MONTHLY=333333
NEXT_PUBLIC_LS_PRO_YEARLY=444444

EXCHANGE_RATE_API_KEY=your-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-random-secret
```

### 3. Veritabanı migration'ları

```bash
npx supabase db push
# veya supabase/migrations/ altındaki SQL dosyalarını sırayla çalıştır
```

### 4. Geliştirme sunucusu

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run start` | Production sunucusu |
| `npm run type-check` | TypeScript kontrol |
| `npm run cron` | Arka plan cron işleri |

## Özellikler

- **Dashboard** — Gelir/gider grafikleri, delta'lı stat kartları, son işlemler, yaklaşan vergiler, proje kârlılığı
- **Gelir / Gider** — Kategorize işlemler, tekrarlayan girişler, çoklu para birimi
- **Projeler** — Bütçe takibi, renk etiketleme, kârlılık analizi
- **Müşteriler** — Gelir toplamları, açık faturalar
- **Faturalar** — PDF üretimi, KDV, indirim, otomatik numaralandırma (FK-YYYY-NNNN)
- **Vergi Takvimi** — TR/US şablonları, özel hatırlatmalar
- **Döviz** — Günlük USD kurları (exchangerate-api.com)
- **Raporlar** — Pro plan özelliği
- **Ayarlar** — Profil, faturalama, plan yönetimi

## Planlar

| Plan | Fiyat |
|---|---|
| Ücretsiz | ₺0 |
| Basic | ₺249/ay · ₺2.390/yıl |
| Pro | ₺699/ay · ₺6.710/yıl |

## Deploy

### Docker

```bash
cd docker
cp ../.env.example .env
docker compose run --rm certbot   # ilk kez SSL
docker compose up -d
```

### GitHub Actions

Repo'ya şu secret'ları ekle: `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_PORT`, `APP_DIR`

`main`'e push → otomatik deploy.

## Proje Yapısı

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/         # login, register, forgot-password
│   │   ├── (dashboard)/    # korumalı sayfalar
│   │   └── page.tsx        # landing page
│   └── api/
│       ├── auth/callback/
│       ├── cron/           # exchange-sync, tax-reminders
│       ├── exchange-rates/
│       ├── invoices/generate-pdf/
│       └── webhooks/lemon-squeezy/
├── components/
│   ├── ui/                 # Button, Card, Input, Modal, Table...
│   ├── layout/             # Sidebar, Topbar, MobileNav
│   ├── dashboard/          # StatCard, RevenueChart...
│   ├── auth/               # LoginForm, RegisterForm...
│   └── landing/            # Hero, Features, Testimonials, PricingCards...
├── lib/
│   ├── actions/            # Server Actions (CRUD)
│   ├── constants/          # currencies, categories, plans, tax-dates
│   ├── supabase/           # client, server, admin, middleware
│   └── utils/              # cn, currency, date, validation
└── i18n/
supabase/
├── config.toml
└── migrations/
public/
└── locales/tr,en/
scripts/cron.ts
docker/
.github/workflows/deploy.yml
```

## Lisans

MIT — [kutluhangil](https://github.com/kutluhangil/Freelora)
