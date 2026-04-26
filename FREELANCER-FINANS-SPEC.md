# FreelancerKit — Freelancer Finans Yönetim Aracı

## Proje Spesifikasyon Dokümanı (Claude Code için)

> **Bu dosya, projenin tüm teknik, tasarım ve iş mantığı detaylarını içerir.**
> **Claude Code'a bu dosyayı vererek projeyi adım adım inşa edeceksin.**

---

## 1. PROJE ÖZETİ

**Proje Adı:** FreelancerKit
**Slogan TR:** "Freelance işini kontrol altına al."
**Slogan EN:** "Take control of your freelance business."

**Ne yapar:**
Freelancerlar için özel tasarlanmış, minimalist ve premium bir finans yönetim aracı. Düzensiz gelir takibi, proje bazlı kârlılık analizi, PDF fatura oluşturma, vergi hatırlatma takvimi ve çoklu para birimi desteği sunar.

**Hedef Kitle:** Türkiye ve global freelancerlar (yazılımcı, tasarımcı, içerik üretici, danışman).

**Dil Desteği:** Türkçe (TR) + İngilizce (EN) — tam i18n desteği.

---

## 2. TEKNOLOJİ STACK'İ

| Katman | Teknoloji | Açıklama |
|---|---|---|
| **Frontend** | Next.js 14+ (App Router) | SSR, RSC, file-based routing |
| **Styling** | Tailwind CSS 3.4+ | Utility-first, custom design tokens |
| **Animasyon** | Framer Motion 11+ | Sayfa geçişleri, mikro-etkileşimler |
| **State** | Zustand | Lightweight global state |
| **i18n** | next-intl | TR/EN dil desteği |
| **Fatura PDF** | @react-pdf/renderer | Profesyonel PDF fatura üretimi |
| **Grafikler** | Recharts | Gelir/gider/kârlılık grafikleri |
| **Auth** | Supabase Auth | Email/password + Google OAuth |
| **Veritabanı** | Supabase (PostgreSQL) | RLS, realtime, edge functions |
| **Storage** | Supabase Storage | Fatura PDF'leri, profil resimleri |
| **Ödeme** | Lemon Squeezy | Abonelik yönetimi, webhook |
| **Döviz Kuru** | exchangerate-api.com | Ücretsiz API, günlük güncelleme |
| **Deployment** | Docker + Ubuntu Server | Self-hosted backend |
| **Reverse Proxy** | Nginx veya Caddy | SSL, domain yönlendirme |
| **CI/CD** | GitHub Actions | Otomatik build ve deploy |

---

## 3. DOSYA YAPISI (STRUCTURE)

```
freelancerkit/
├── .github/
│   └── workflows/
│       └── deploy.yml                    # GitHub Actions CI/CD
├── docker/
│   ├── Dockerfile                        # Next.js production build
│   ├── docker-compose.yml                # Tüm servisler
│   ├── docker-compose.dev.yml            # Development ortamı
│   └── nginx/
│       └── default.conf                  # Nginx reverse proxy config
├── public/
│   ├── locales/
│   │   ├── tr/
│   │   │   └── common.json              # Türkçe çeviriler
│   │   └── en/
│   │       └── common.json              # İngilizce çeviriler
│   ├── fonts/                            # Custom fontlar (woff2)
│   └── icons/                            # Favicon, PWA ikonları
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx                # Root layout (i18n wrapper)
│   │   │   ├── page.tsx                  # Landing page
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx            # Dashboard layout (sidebar + topbar)
│   │   │   │   ├── dashboard/page.tsx    # Ana dashboard (özet)
│   │   │   │   ├── income/
│   │   │   │   │   ├── page.tsx          # Gelir listesi
│   │   │   │   │   └── [id]/page.tsx     # Gelir detay
│   │   │   │   ├── expenses/
│   │   │   │   │   ├── page.tsx          # Gider listesi
│   │   │   │   │   └── [id]/page.tsx     # Gider detay
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx          # Proje listesi
│   │   │   │   │   └── [id]/page.tsx     # Proje detay + kârlılık
│   │   │   │   ├── invoices/
│   │   │   │   │   ├── page.tsx          # Fatura listesi
│   │   │   │   │   ├── new/page.tsx      # Yeni fatura oluştur
│   │   │   │   │   └── [id]/page.tsx     # Fatura detay + PDF önizleme
│   │   │   │   ├── clients/
│   │   │   │   │   ├── page.tsx          # Müşteri listesi
│   │   │   │   │   └── [id]/page.tsx     # Müşteri detay
│   │   │   │   ├── calendar/page.tsx     # Vergi takvimi + hatırlatmalar
│   │   │   │   ├── reports/page.tsx      # Raporlama (Pro)
│   │   │   │   ├── settings/
│   │   │   │   │   ├── page.tsx          # Genel ayarlar
│   │   │   │   │   ├── billing/page.tsx  # Plan ve ödeme
│   │   │   │   │   └── profile/page.tsx  # Profil düzenleme
│   │   │   │   └── currency/page.tsx     # Döviz kurları (Pro)
│   │   │   └── pricing/page.tsx          # Fiyatlandırma sayfası
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   └── lemon-squeezy/route.ts  # Lemon Squeezy webhook
│   │   │   ├── invoices/
│   │   │   │   └── generate-pdf/route.ts   # PDF oluşturma endpoint
│   │   │   ├── exchange-rates/route.ts     # Döviz kuru proxy
│   │   │   ├── cron/
│   │   │   │   ├── tax-reminders/route.ts  # Vergi hatırlatma cron
│   │   │   │   └── exchange-sync/route.ts  # Döviz kuru senkronizasyon
│   │   │   └── auth/
│   │   │       └── callback/route.ts       # Supabase auth callback
│   │   └── globals.css                     # Global stiller + design tokens
│   ├── components/
│   │   ├── ui/                             # Temel UI bileşenleri
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── CurrencyInput.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx                 # Yan menü (collapse animasyonu)
│   │   │   ├── Topbar.tsx                  # Üst bar (dil, profil, bildirim)
│   │   │   ├── MobileNav.tsx               # Mobil navigasyon
│   │   │   └── PageTransition.tsx          # Sayfa geçiş animasyonu
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx                # Animasyonlu stat kartları
│   │   │   ├── RevenueChart.tsx            # Gelir grafiği
│   │   │   ├── ProjectProfitChart.tsx      # Proje kârlılık grafiği
│   │   │   ├── RecentTransactions.tsx      # Son işlemler tablosu
│   │   │   ├── UpcomingTaxes.tsx           # Yaklaşan vergi tarihleri
│   │   │   └── CurrencyWidget.tsx          # Anlık döviz kurları
│   │   ├── invoices/
│   │   │   ├── InvoiceForm.tsx             # Fatura formu
│   │   │   ├── InvoicePreview.tsx          # Canlı önizleme
│   │   │   ├── InvoicePDF.tsx              # React-PDF şablonu
│   │   │   └── InvoiceStatusBadge.tsx      # Durum göstergesi
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProfitabilityGauge.tsx      # Kârlılık göstergesi
│   │   │   └── TimeTracker.tsx             # Zaman takibi (opsiyonel)
│   │   ├── calendar/
│   │   │   ├── TaxCalendar.tsx             # Vergi takvimi
│   │   │   └── ReminderCard.tsx            # Hatırlatma kartları
│   │   ├── landing/
│   │   │   ├── Hero.tsx                    # Hero section (animasyonlu)
│   │   │   ├── Features.tsx                # Özellikler grid
│   │   │   ├── PricingCards.tsx             # Fiyatlandırma kartları
│   │   │   ├── Testimonials.tsx            # Kullanıcı yorumları
│   │   │   └── Footer.tsx
│   │   └── shared/
│   │       ├── LanguageSwitcher.tsx         # TR/EN geçiş
│   │       ├── CurrencySelector.tsx         # Para birimi seçici
│   │       ├── ThemeToggle.tsx              # Dark/light (opsiyonel)
│   │       └── LoadingScreen.tsx            # Tam sayfa loading
│   ├── hooks/
│   │   ├── useAuth.ts                       # Auth hook
│   │   ├── useSupabase.ts                   # Supabase client hook
│   │   ├── useExchangeRate.ts               # Döviz kuru hook
│   │   ├── useCurrency.ts                   # Para birimi formatlama
│   │   ├── useSubscription.ts               # Plan durumu hook
│   │   ├── useProjects.ts                   # Proje CRUD hook
│   │   ├── useInvoices.ts                   # Fatura CRUD hook
│   │   ├── useTransactions.ts               # Gelir/gider hook
│   │   └── useMediaQuery.ts                 # Responsive hook
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                    # Browser client
│   │   │   ├── server.ts                    # Server client
│   │   │   ├── admin.ts                     # Admin/service role client
│   │   │   └── middleware.ts                # Auth middleware
│   │   ├── lemon-squeezy/
│   │   │   ├── client.ts                    # LS API client
│   │   │   ├── plans.ts                     # Plan konfigürasyonu
│   │   │   └── webhook-handler.ts           # Webhook işleme
│   │   ├── exchange-rate/
│   │   │   └── client.ts                    # Exchange rate API client
│   │   ├── pdf/
│   │   │   ├── invoice-template.tsx         # PDF şablon bileşeni
│   │   │   └── generator.ts                # PDF oluşturma fonksiyonu
│   │   ├── utils/
│   │   │   ├── currency.ts                  # Para birimi formatlama
│   │   │   ├── date.ts                      # Tarih yardımcıları
│   │   │   ├── tax.ts                       # Vergi hesaplama
│   │   │   └── validation.ts                # Form validasyonları
│   │   └── constants/
│   │       ├── plans.ts                     # Plan tanımları ve fiyatlar
│   │       ├── currencies.ts                # Desteklenen para birimleri
│   │       ├── tax-dates.ts                 # TR ve global vergi tarihleri
│   │       └── countries.ts                 # Ülke listesi
│   ├── stores/
│   │   ├── authStore.ts                     # Auth state
│   │   ├── uiStore.ts                       # UI state (sidebar, modal)
│   │   └── filterStore.ts                   # Filtre state
│   ├── types/
│   │   ├── database.ts                      # Supabase DB tipleri
│   │   ├── invoice.ts                       # Fatura tipleri
│   │   ├── project.ts                       # Proje tipleri
│   │   ├── transaction.ts                   # İşlem tipleri
│   │   ├── subscription.ts                  # Abonelik tipleri
│   │   └── common.ts                        # Ortak tipler
│   ├── i18n/
│   │   ├── config.ts                        # i18n konfigürasyonu
│   │   ├── request.ts                       # Server-side i18n
│   │   └── navigation.ts                    # Localized navigation
│   └── middleware.ts                        # Next.js middleware (auth + i18n)
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql           # Ana tablo yapıları
│   │   ├── 002_rls_policies.sql             # Row Level Security
│   │   ├── 003_functions.sql                # DB fonksiyonları
│   │   ├── 004_triggers.sql                 # Triggerlar
│   │   └── 005_seed.sql                     # Test verileri
│   └── config.toml                          # Supabase local config
├── .env.local.example                       # Env değişkenleri şablonu
├── next.config.ts                           # Next.js konfigürasyonu
├── tailwind.config.ts                       # Tailwind konfigürasyonu
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. VERİTABANI ŞEMASI (SUPABASE / POSTGRESQL)

### 4.1. Tablolar

```sql
-- ==========================================
-- KULLANICILAR
-- ==========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  tax_id TEXT,                          -- Vergi kimlik no
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'TR',
  preferred_currency TEXT DEFAULT 'TRY',
  locale TEXT DEFAULT 'tr',             -- tr | en
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',             -- free | basic | pro
  plan_status TEXT DEFAULT 'active',    -- active | canceled | past_due
  lemon_squeezy_customer_id TEXT,
  lemon_squeezy_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- MÜŞTERİLER
-- ==========================================
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  tax_id TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  currency TEXT DEFAULT 'TRY',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PROJELER
-- ==========================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',        -- active | completed | paused | canceled
  budget_amount DECIMAL(12,2),
  budget_currency TEXT DEFAULT 'TRY',
  hourly_rate DECIMAL(8,2),
  estimated_hours DECIMAL(8,2),
  actual_hours DECIMAL(8,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  color TEXT DEFAULT '#6B7280',        -- Proje renk kodu (UI'da)
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- GELİR / GİDER İŞLEMLERİ
-- ==========================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  type TEXT NOT NULL,                   -- income | expense
  category TEXT NOT NULL,               -- freelance_income | subscription | software | hardware | tax | office | travel | other
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'TRY',
  amount_in_base DECIMAL(12,2),         -- Temel para birimine çevrilmiş tutar
  exchange_rate DECIMAL(12,6),          -- İşlem anındaki kur
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  recurring_interval TEXT,              -- monthly | quarterly | yearly
  receipt_url TEXT,                     -- Fiş/makbuz fotoğrafı
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- FATURALAR
-- ==========================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,          -- Otomatik: FK-2025-0001
  status TEXT DEFAULT 'draft',           -- draft | sent | paid | overdue | canceled
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  currency TEXT DEFAULT 'TRY',
  subtotal DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,       -- KDV oranı
  tax_amount DECIMAL(12,2) DEFAULT 0,
  discount_rate DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  notes TEXT,                             -- Fatura notu
  payment_terms TEXT,                     -- Ödeme koşulları
  pdf_url TEXT,                           -- Oluşturulan PDF linki
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- FATURA KALEMLERİ
-- ==========================================
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- VERGİ HATIRLATMALARi
-- ==========================================
CREATE TABLE public.tax_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  reminder_date DATE NOT NULL,           -- Hatırlatma tarihi (due_date - X gün)
  type TEXT NOT NULL,                     -- kdv | gelir_vergisi | stopaj | sgk | custom
  country TEXT DEFAULT 'TR',
  is_recurring BOOLEAN DEFAULT true,
  recurring_interval TEXT,               -- monthly | quarterly | yearly
  is_completed BOOLEAN DEFAULT false,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- DÖVİZ KURLARI (CACHE)
-- ==========================================
CREATE TABLE public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL,
  rate DECIMAL(12,6) NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(base_currency, target_currency)
);

-- ==========================================
-- ABONELİK GEÇMİŞİ
-- ==========================================
CREATE TABLE public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,              -- created | renewed | canceled | paused | resumed | payment_failed
  plan TEXT NOT NULL,
  lemon_squeezy_event_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- İNDEXLER
-- ==========================================
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_project_id ON public.transactions(project_id);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_tax_reminders_user_id ON public.tax_reminders(user_id);
CREATE INDEX idx_tax_reminders_due_date ON public.tax_reminders(due_date);
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
```

### 4.2. Row Level Security (RLS)

```sql
-- Tüm tablolarda RLS aktif
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Örnek policy: Kullanıcı sadece kendi verisini görsün
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Aynı pattern: clients, projects, transactions, invoices, tax_reminders
-- Her tabloda: user_id = auth.uid() kontrolü
-- invoice_items için: invoice_id üzerinden join ile kontrol
```

### 4.3. Database Fonksiyonları

```sql
-- Proje kârlılık hesaplama
CREATE OR REPLACE FUNCTION calculate_project_profitability(p_project_id UUID)
RETURNS TABLE (
  total_income DECIMAL,
  total_expense DECIMAL,
  net_profit DECIMAL,
  profit_margin DECIMAL,
  hours_logged DECIMAL,
  effective_hourly_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount_in_base ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount_in_base ELSE 0 END), 0) as total_expense,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount_in_base ELSE -t.amount_in_base END), 0) as net_profit,
    CASE
      WHEN SUM(CASE WHEN t.type = 'income' THEN t.amount_in_base ELSE 0 END) > 0
      THEN (SUM(CASE WHEN t.type = 'income' THEN t.amount_in_base ELSE -t.amount_in_base END) /
            SUM(CASE WHEN t.type = 'income' THEN t.amount_in_base ELSE 0 END)) * 100
      ELSE 0
    END as profit_margin,
    p.actual_hours as hours_logged,
    CASE
      WHEN p.actual_hours > 0
      THEN SUM(CASE WHEN t.type = 'income' THEN t.amount_in_base ELSE -t.amount_in_base END) / p.actual_hours
      ELSE 0
    END as effective_hourly_rate
  FROM public.projects p
  LEFT JOIN public.transactions t ON t.project_id = p.id
  WHERE p.id = p_project_id
  GROUP BY p.actual_hours;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aylık gelir/gider özeti
CREATE OR REPLACE FUNCTION get_monthly_summary(
  p_user_id UUID,
  p_year INT,
  p_month INT
)
RETURNS TABLE (
  total_income DECIMAL,
  total_expense DECIMAL,
  net_income DECIMAL,
  transaction_count INT,
  top_category TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount_in_base ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount_in_base ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount_in_base ELSE -amount_in_base END), 0),
    COUNT(*)::INT,
    (SELECT category FROM public.transactions
     WHERE user_id = p_user_id AND EXTRACT(YEAR FROM date) = p_year AND EXTRACT(MONTH FROM date) = p_month
     GROUP BY category ORDER BY SUM(amount_in_base) DESC LIMIT 1)
  FROM public.transactions
  WHERE user_id = p_user_id
    AND EXTRACT(YEAR FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. TASARIM SİSTEMİ

### 5.1. Konsept

**Tema:** "Obsidian Finance" — Koyu tonlarda, premium hissiyat, keskin hatlar, minimal ama güçlü.
**İlham:** Bir lüks saat markasının dijital dashboard'u gibi düşün. Her detay hesaplanmış, gereksiz hiçbir şey yok.

### 5.2. Renk Paleti

```css
:root {
  /* === ANA RENKLER (Dark Foundation) === */
  --color-bg-primary: #0A0A0B;          /* Derin siyah — ana zemin */
  --color-bg-secondary: #111113;         /* Koyu gri — kartlar, paneller */
  --color-bg-tertiary: #1A1A1D;          /* Orta koyu — hover, aktif alanlar */
  --color-bg-elevated: #222225;          /* Yükseltilmiş yüzeyler */

  /* === BORDER & DIVIDER === */
  --color-border-subtle: #2A2A2E;        /* İnce ayırıcılar */
  --color-border-default: #333338;       /* Normal sınırlar */
  --color-border-strong: #4A4A50;        /* Vurgulu sınırlar */

  /* === METİN === */
  --color-text-primary: #F5F5F7;         /* Ana metin — parlak beyaz */
  --color-text-secondary: #A1A1A6;       /* İkincil metin — soluk gri */
  --color-text-tertiary: #6B6B70;        /* Tersiyer metin — koyu gri */
  --color-text-muted: #48484D;           /* Çok soluk — placeholder */

  /* === ACCENT (Tek bir güçlü vurgu rengi) === */
  --color-accent: #C8FF00;              /* Neon lime — dikkat çekici, enerji */
  --color-accent-hover: #D4FF33;         /* Hover state */
  --color-accent-muted: rgba(200, 255, 0, 0.12); /* Arka plan vurgu */
  --color-accent-text: #0A0A0B;          /* Accent üzerinde metin */

  /* === SEMANTİK RENKLER === */
  --color-success: #34D399;              /* Yeşil — gelir, başarı */
  --color-success-muted: rgba(52, 211, 153, 0.12);
  --color-warning: #FBBF24;             /* Sarı — uyarı, beklemede */
  --color-warning-muted: rgba(251, 191, 36, 0.12);
  --color-danger: #F87171;              /* Kırmızı — gider, hata */
  --color-danger-muted: rgba(248, 113, 113, 0.12);
  --color-info: #60A5FA;                /* Mavi — bilgi */
  --color-info-muted: rgba(96, 165, 250, 0.12);

  /* === EFEKTLER === */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.5);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 20px rgba(200, 255, 0, 0.15);  /* Accent glow */

  /* === GLASSMORPHISM === */
  --glass-bg: rgba(17, 17, 19, 0.7);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-blur: 12px;

  /* === BORDER RADIUS === */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* === GEÇIŞLER === */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 5.3. Tipografi

```css
/* Font Stack — Google Fonts üzerinden yükle */

/* Başlık fontu: Manrope — geometrik, modern, premium */
/* Alternatif: Satoshi veya General Sans (eğer CDN'den çekilebiliyorsa) */
--font-display: 'Manrope', system-ui, sans-serif;

/* Gövde fontu: Geist veya IBM Plex Sans — temiz, okunabilir */
--font-body: 'Geist', 'IBM Plex Sans', system-ui, sans-serif;

/* Mono fontu: JetBrains Mono — rakamlar ve kodlar için */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Boyutlar */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.8125rem;     /* 13px */
--text-base: 0.875rem;    /* 14px — dashboard base */
--text-md: 1rem;           /* 16px */
--text-lg: 1.125rem;       /* 18px */
--text-xl: 1.25rem;        /* 20px */
--text-2xl: 1.5rem;        /* 24px */
--text-3xl: 2rem;          /* 32px */
--text-4xl: 2.5rem;        /* 40px */
--text-5xl: 3.5rem;        /* 56px — landing hero */

/* Ağırlıklar */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;

/* Letter spacing */
--tracking-tight: -0.02em;    /* Büyük başlıklar */
--tracking-normal: 0;
--tracking-wide: 0.05em;      /* Küçük etiketler, badge'ler */

/* Rakamlar her zaman mono font ile gösterilecek */
/* Para tutarları: font-variant-numeric: tabular-nums; */
```

### 5.4. Animasyonlar ve Efektler

```
Framer Motion ile uygulanacak animasyonlar:

1. SAYFA GEÇİŞLERİ
   - Fade + hafif yukarı kayma (y: 12px → 0)
   - Duration: 0.3s, ease: [0.4, 0, 0.2, 1]

2. KART GİRİŞLERİ (Staggered)
   - Dashboard stat kartları sırayla belirsin
   - Her kart 0.08s gecikmeyle
   - Scale: 0.96 → 1, opacity: 0 → 1

3. RAKAM ANİMASYONU (CountUp)
   - Dashboard'daki toplam tutar, gelir, gider rakamları
   - 0'dan hedef sayıya animasyonlu sayma
   - Duration: 1.2s, ease: easeOut

4. HOVER EFEKTLERİ
   - Kartlar: subtle scale (1.01) + border glow
   - Butonlar: background shift + shadow artışı
   - Tablo satırları: bg-color transition

5. SIDEBAR
   - Collapse/expand: width animasyonu (240px ↔ 72px)
   - İkonlar sabit kalır, metinler fade out/in
   - Duration: 0.3s

6. MODAL / DRAWER
   - Backdrop: opacity fade (0.4s)
   - İçerik: scale (0.95 → 1) + fade
   - Kapatma: ters animasyon

7. TOAST BİLDİRİMLERİ
   - Sağ üstten kayarak giriş (x: 100 → 0)
   - Auto-dismiss: 4s sonra fade out
   - Stacking: birden fazla toast dikey sıra

8. GRAFİK ANİMASYONLARI
   - Recharts çizgi grafik: soldan sağa çizilsin
   - Bar chart: aşağıdan yukarı büyüsün
   - Donut chart: saat yönünde doldurulsun

9. SKELETON LOADING
   - Pulse animasyonu: opacity 0.3 ↔ 0.8
   - Gradient shimmer efekti soldan sağa

10. MICRO-INTERACTIONS
    - Checkbox: scale bounce (0.8 → 1.1 → 1)
    - Toggle switch: spring animasyonu
    - Dropdown açılma: height auto + fade
    - Badge sayı değişimi: flip animasyonu
```

### 5.5. Özel UI Detayları

```
DASHBOARD LAYOUT:
- Sol: Sidebar (collapse edilebilir, ikonlu)
- Üst: Topbar (arama, dil, bildirim, profil)
- Orta: Ana içerik (scroll)
- Sidebar aktif öğe: sol kenarda 3px accent bar

KARTLAR:
- Background: var(--color-bg-secondary)
- Border: 1px solid var(--color-border-subtle)
- Hover'da border: var(--color-border-default) + subtle glow
- İç padding: 20px-24px
- Radius: var(--radius-lg)

TABLOLAR:
- Başlık satırı: uppercase, var(--tracking-wide), var(--text-xs), var(--color-text-tertiary)
- Zebra striping yok — hover highlight ile
- Satır arası: 1px border-bottom var(--color-border-subtle)
- Mobilde: horizontal scroll veya card view'a dönüşüm

FORMLAR:
- Input bg: var(--color-bg-tertiary)
- Focus: accent border + glow
- Label: üstte, var(--text-sm), var(--color-text-secondary)
- Error: kırmızı border + alt metin

BUTONLAR:
- Primary: bg accent, text siyah, bold
- Secondary: bg transparent, border, text beyaz
- Ghost: bg transparent, text gri, hover'da bg tertiary
- Hepsi: radius-md, padding 10px 20px, transition-fast
```

---

## 6. ÖZELLİKLER DETAYI

### 6.1. Dashboard (Ana Sayfa)

```
ÜST BÖLÜM — 4 Stat Kartı (Grid)
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Bu Ayki      │ │  Bu Ayki      │ │  Net Kâr      │ │  Bekleyen     │
│  Gelir        │ │  Gider        │ │               │ │  Faturalar    │
│  ₺24,500 ↑12% │ │  ₺8,200 ↓5%  │ │  ₺16,300     │ │  3 adet       │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

ORTA BÖLÜM — 2 Kolon
Sol: Gelir/Gider Çizgi Grafiği (son 6 ay)
Sağ: Proje Bazlı Kârlılık Bar Chart (top 5)

ALT BÖLÜM — 2 Kolon
Sol: Son İşlemler Tablosu (son 10 kayıt)
Sağ: Yaklaşan Vergi Tarihleri + Döviz Kurları Widget
```

- Stat kartlarındaki rakamlar countUp animasyonu ile sayılsın
- Grafikler Recharts ile, açılışta animasyonlu
- Tüm veriler gerçek zamanlı Supabase'den

### 6.2. Gelir/Gider Takibi (Transactions)

**Özellikler:**
- Gelir ve gider ekleme formu (modal veya drawer)
- Kategori seçimi (önceden tanımlı + özel)
- Proje ve müşteri bağlama
- Para birimi seçimi (TRY, USD, EUR, GBP...)
- Tekrarlayan işlem tanımlama
- Fiş/makbuz yükleme (Supabase Storage)
- Filtreleme: tarih aralığı, tür, kategori, proje, müşteri
- Toplu silme ve düzenleme
- CSV/Excel export (Pro)

**Kategoriler:**
```
GELİR:
- Freelance gelir
- Danışmanlık
- Pasif gelir
- Diğer

GİDER:
- Yazılım & Abonelik
- Donanım
- Ofis / Co-working
- Ulaşım
- Eğitim
- Vergi & SGK
- Muhasebeci
- Reklam & Pazarlama
- Diğer
```

### 6.3. Proje Yönetimi

**Özellikler:**
- Proje oluşturma: ad, müşteri, bütçe, saatlik ücret, başlangıç/bitiş
- Proje durumları: Aktif / Tamamlandı / Duraklatıldı / İptal
- Proje bazlı gelir ve gider takibi
- Kârlılık analizi:
  - Toplam gelir vs gider
  - Net kâr ve kâr marjı (%)
  - Saatlik efektif ücret
  - Bütçe kullanım yüzdesi (progress bar)
- Proje kartları: renk kodlu, hızlı özet
- Proje detay sayfası: timeline, finansal özet, bağlı faturalar

### 6.4. Fatura Oluşturma (Invoice)

**Fatura Formu:**
- Müşteri seçimi (otomatik bilgi doldurma)
- Proje bağlama
- Fatura numarası: otomatik (FK-YYYY-NNNN formatı)
- Fatura kalemleri: açıklama, miktar, birim fiyat, toplam
  - Sürükle-bırak sıralama
  - Kalem ekleme/silme
- Alt toplam, KDV oranı (%), indirim (%), genel toplam
- Para birimi seçimi
- Ödeme vadesi (tarih seçici)
- Not alanı
- Ödeme koşulları (şablon veya serbest metin)

**PDF Şablonu (@react-pdf/renderer):**
- Profesyonel, minimalist tasarım (siyah-beyaz-accent)
- Kullanıcının firma bilgileri (logo opsiyonel)
- Müşteri bilgileri
- Fatura kalemleri tablosu
- Toplamlar bölümü
- Ödeme bilgileri (IBAN, banka adı)
- QR kod opsiyonel
- A4 sayfa boyutu

**Fatura Durumları:**
- Taslak → Gönderildi → Ödendi / Gecikmiş / İptal
- Durum değişikliğinde otomatik tarih kaydı
- Gecikmiş faturalar için dashboard'da uyarı

### 6.5. Vergi Takvimi

**Türkiye Vergi Takvimi (Varsayılan):**
```
- KDV Beyannamesi: Her ayın 28'i
- Muhtasar (Stopaj): 3 ayda bir (Ocak, Nisan, Temmuz, Ekim - 26'sı)
- Geçici Vergi: 3 ayda bir (Şubat, Mayıs, Ağustos, Kasım - 17'si)
- Gelir Vergisi Beyanı: Mart 1-31
- Yıllık KDV Beyanı: Mart
- SGK Primi: Her ayın son günü
- Bağ-Kur: Her ayın son günü
```

**Global Kullanıcılar İçin:**
- ABD: Quarterly estimated tax (Nisan 15, Haziran 15, Eylül 15, Ocak 15)
- AB: Ülkeye göre VAT tarihleri
- Özel hatırlatma ekleme imkanı

**Hatırlatma Sistemi:**
- Vergi tarihinden 7, 3 ve 1 gün önce bildirim
- Dashboard widget'ında yaklaşan tarihler
- E-posta hatırlatma (cron job ile)
- Tamamlandı olarak işaretleme

### 6.6. Çoklu Para Birimi (Pro Özellik)

**Desteklenen Para Birimleri:**
TRY, USD, EUR, GBP, CHF, JPY, CAD, AUD, SEK, NOK, DKK, PLN, CZK, HUF, RON, BGN, HRK, RUB, UAH, INR, BRL, MXN, ARS, COP, AED, SAR, QAR, KWD, BHD, OMR, SGD, HKD, TWD, KRW, THB, MYR, PHP, IDR, VND, ZAR, NGN, KES, EGP, MAD, TND, ILS

**Özellikler:**
- exchangerate-api.com'dan günlük kur çekme (free tier: 1500 istek/ay)
- Her işlemde anlık kuru kaydetme
- Temel para birimi (base currency) ayarı
- Tüm tutarları base currency'e otomatik çevirme
- Dashboard'da mini döviz widgeti (USD, EUR, GBP → TRY)
- Kur geçmişi grafiği (Pro)

### 6.7. Raporlama (Pro Özellik)

**Rapor Türleri:**
- Aylık/Çeyreklik/Yıllık Gelir-Gider Raporu
- Proje Bazlı Kârlılık Raporu
- Müşteri Bazlı Gelir Raporu
- Kategori Bazlı Gider Dağılımı
- Vergi Özet Raporu (yıllık)
- Nakit Akış Raporu

**Çıktı Formatları:**
- Dashboard'da interaktif grafikler
- PDF export
- CSV export

---

## 7. FİYATLANDIRMA

### 7.1. Plan Yapısı

```typescript
export const PLANS = {
  // === FREE ===
  free: {
    name: { tr: 'Ücretsiz', en: 'Free' },
    price: { tr: 0, en: 0 },
    features: {
      maxProjects: 2,
      maxClients: 3,
      maxInvoicesPerMonth: 3,
      maxTransactionsPerMonth: 30,
      currencies: ['TRY'],
      pdfInvoice: true,
      taxCalendar: true,         // Sadece TR
      reports: false,
      csvExport: false,
      emailReminders: false,
      customCategories: false,
      receiptUpload: false,
    }
  },

  // === BASIC ===
  basic: {
    name: { tr: 'Basic', en: 'Basic' },
    price: {
      monthly: { tr: 249, en: 14, currency: { tr: 'TRY', en: 'USD' } },
      yearly: { tr: 2390, en: 134, currency: { tr: 'TRY', en: 'USD' } }, // ~%20 indirim
    },
    lemonSqueezy: {
      monthly: { tr: 'variant_id_basic_monthly_tr', en: 'variant_id_basic_monthly_en' },
      yearly: { tr: 'variant_id_basic_yearly_tr', en: 'variant_id_basic_yearly_en' },
    },
    features: {
      maxProjects: 10,
      maxClients: 20,
      maxInvoicesPerMonth: 20,
      maxTransactionsPerMonth: 500,
      currencies: ['TRY', 'USD', 'EUR'],
      pdfInvoice: true,
      taxCalendar: true,
      reports: false,
      csvExport: true,
      emailReminders: true,
      customCategories: true,
      receiptUpload: true,
    }
  },

  // === PRO ===
  pro: {
    name: { tr: 'Pro', en: 'Pro' },
    price: {
      monthly: { tr: 699, en: 39, currency: { tr: 'TRY', en: 'USD' } },
      yearly: { tr: 6710, en: 374, currency: { tr: 'TRY', en: 'USD' } }, // ~%20 indirim
    },
    lemonSqueezy: {
      monthly: { tr: 'variant_id_pro_monthly_tr', en: 'variant_id_pro_monthly_en' },
      yearly: { tr: 'variant_id_pro_yearly_tr', en: 'variant_id_pro_yearly_en' },
    },
    features: {
      maxProjects: Infinity,
      maxClients: Infinity,
      maxInvoicesPerMonth: Infinity,
      maxTransactionsPerMonth: Infinity,
      currencies: 'all',             // Tüm para birimleri
      pdfInvoice: true,
      taxCalendar: true,             // Global vergi takvimleri dahil
      reports: true,                 // Tam raporlama
      csvExport: true,
      emailReminders: true,
      customCategories: true,
      receiptUpload: true,
      multiCurrencyDashboard: true,  // Döviz widget
      exchangeRateHistory: true,     // Kur geçmişi
      advancedReports: true,         // Detaylı raporlar
      prioritySupport: true,
    }
  }
};
```

### 7.2. Fiyatlandırma Sayfası UI

```
Fiyatlandırma sayfası tasarımı:

- 3 kart yan yana (mobilde dikey)
- Pro kart vurgulu: border accent, "Önerilen" badge, subtle glow
- Yıllık/Aylık toggle switch (üstte)
- Yıllık seçildiğinde: "%20 Tasarruf" badge göster
- TRY/USD otomatik locale'e göre (TR kullanıcı → TRY, diğer → USD)
- Her kartın altında: "Başla" butonu (Free), "Satın Al" butonu (Basic/Pro)
- Özellik karşılaştırma tablosu (alt kısımda, collapsible)
- Yıllık fiyat gösterilirken aylık hesaplı fiyat da küçük yazı ile gösterilsin
```

---

## 8. ÖDEME SİSTEMİ (LEMON SQUEEZY)

### 8.1. Entegrasyon Akışı

```
1. KULLANICI "Satın Al" butonuna tıklar
2. Frontend → Lemon Squeezy Checkout URL oluşturur
   - checkout_data.custom.user_id = supabase user id
   - checkout_data.custom.locale = 'tr' | 'en'
   - variant_id = seçilen plan + dönem + locale'e göre
3. Kullanıcı Lemon Squeezy checkout'ta ödeme yapar
4. Lemon Squeezy → Webhook gönderir: /api/webhooks/lemon-squeezy
5. Webhook handler:
   a. İmza doğrulaması (LEMON_SQUEEZY_WEBHOOK_SECRET)
   b. Event tipine göre işlem:
      - subscription_created → profiles.plan güncelle
      - subscription_updated → plan/status güncelle
      - subscription_cancelled → plan = 'free', status = 'canceled'
      - subscription_payment_success → log kaydet
      - subscription_payment_failed → status = 'past_due'
   c. subscription_events tablosuna kayıt
```

### 8.2. Lemon Squeezy Konfigürasyonu

```
Lemon Squeezy'de oluşturulacaklar:

1. STORE: "FreelancerKit" adında store
2. PRODUCTS:
   - "FreelancerKit Basic" — 2 variant (monthly/yearly) × 2 fiyat (TR/EN)
   - "FreelancerKit Pro" — 2 variant (monthly/yearly) × 2 fiyat (TR/EN)
3. WEBHOOKS:
   - URL: https://yourdomain.com/api/webhooks/lemon-squeezy
   - Events: subscription_created, subscription_updated, subscription_cancelled,
             subscription_payment_success, subscription_payment_failed
4. CHECKOUT OVERLAY: Embedded checkout (iframe) veya redirect
```

### 8.3. Webhook Handler Kodu Şablonu

```typescript
// src/app/api/webhooks/lemon-squeezy/route.ts

import crypto from 'crypto';
import { createClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-signature');

  // İmza doğrulama
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');

  if (digest !== signature) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventName = event.meta.event_name;
  const userId = event.meta.custom_data?.user_id;
  const supabase = createClient();

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_updated': {
      const plan = event.data.attributes.variant_name.includes('Pro') ? 'pro' : 'basic';
      const status = event.data.attributes.status; // active, paused, cancelled, etc.

      await supabase.from('profiles').update({
        plan,
        plan_status: status,
        lemon_squeezy_customer_id: event.data.attributes.customer_id?.toString(),
        lemon_squeezy_subscription_id: event.data.id?.toString(),
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
      break;
    }

    case 'subscription_cancelled': {
      await supabase.from('profiles').update({
        plan: 'free',
        plan_status: 'canceled',
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
      break;
    }

    case 'subscription_payment_failed': {
      await supabase.from('profiles').update({
        plan_status: 'past_due',
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
      break;
    }
  }

  // Event log
  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: eventName,
    plan: event.data.attributes.variant_name,
    lemon_squeezy_event_id: event.data.id?.toString(),
    metadata: event.data.attributes,
  });

  return new Response('OK', { status: 200 });
}
```

---

## 9. DÖVİZ KURU ENTEGRASYOnu

### 9.1. API Kullanımı

```typescript
// src/lib/exchange-rate/client.ts

const BASE_URL = 'https://v6.exchangerate-api.com/v6';
const API_KEY = process.env.EXCHANGE_RATE_API_KEY; // Free tier: 1500 req/month

export async function getExchangeRates(baseCurrency: string = 'USD') {
  const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${baseCurrency}`);
  const data = await response.json();

  if (data.result !== 'success') {
    throw new Error('Exchange rate fetch failed');
  }

  return data.conversion_rates; // { TRY: 38.45, EUR: 0.92, ... }
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  const rates = await getExchangeRates(from);
  return amount * rates[to];
}
```

### 9.2. Senkronizasyon Cron Job

```
- Her gün 1 kez exchange_rates tablosunu güncelle
- Cron: 0 6 * * * (her sabah 06:00 UTC)
- Vercel Cron veya Docker'da node-cron kullan
- Tüm desteklenen para birimleri için USD bazlı kurları kaydet
- İşlem oluşturulurken o anki kuru exchange_rates'ten al ve transaction'a yaz
```

---

## 10. DOCKER & DEPLOYMENT

### 10.1. Docker Compose

```yaml
# docker/docker-compose.yml

version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: freelancerkit-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - LEMON_SQUEEZY_API_KEY=${LEMON_SQUEEZY_API_KEY}
      - LEMON_SQUEEZY_WEBHOOK_SECRET=${LEMON_SQUEEZY_WEBHOOK_SECRET}
      - EXCHANGE_RATE_API_KEY=${EXCHANGE_RATE_API_KEY}
    env_file:
      - ../.env.production
    volumes:
      - app-data:/app/.next/cache
    networks:
      - freelancerkit

  nginx:
    image: nginx:alpine
    container_name: freelancerkit-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - certbot-data:/etc/letsencrypt
      - certbot-www:/var/www/certbot
    depends_on:
      - app
    networks:
      - freelancerkit

  certbot:
    image: certbot/certbot
    container_name: freelancerkit-certbot
    volumes:
      - certbot-data:/etc/letsencrypt
      - certbot-www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

  cron:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: freelancerkit-cron
    restart: unless-stopped
    command: ["node", "scripts/cron.js"]
    environment:
      - NODE_ENV=production
    env_file:
      - ../.env.production
    networks:
      - freelancerkit

volumes:
  app-data:
  certbot-data:
  certbot-www:

networks:
  freelancerkit:
    driver: bridge
```

### 10.2. Dockerfile

```dockerfile
# docker/Dockerfile

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### 10.3. Nginx Konfigürasyonu

```nginx
# docker/nginx/default.conf

upstream nextjs {
    server app:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://nextjs;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 10.4. GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/freelancerkit
            git pull origin main
            docker compose -f docker/docker-compose.yml build --no-cache app
            docker compose -f docker/docker-compose.yml up -d
            docker image prune -f
```

---

## 11. i18n (ÇOK DİLLİ DESTEK)

### 11.1. Çeviri Dosya Yapısı

```json
// public/locales/tr/common.json
{
  "app": {
    "name": "FreelancerKit",
    "tagline": "Freelance işini kontrol altına al."
  },
  "nav": {
    "dashboard": "Panel",
    "income": "Gelirler",
    "expenses": "Giderler",
    "projects": "Projeler",
    "invoices": "Faturalar",
    "clients": "Müşteriler",
    "calendar": "Vergi Takvimi",
    "reports": "Raporlar",
    "settings": "Ayarlar",
    "currency": "Döviz Kurları"
  },
  "dashboard": {
    "monthlyIncome": "Bu Ayki Gelir",
    "monthlyExpense": "Bu Ayki Gider",
    "netProfit": "Net Kâr",
    "pendingInvoices": "Bekleyen Faturalar",
    "recentTransactions": "Son İşlemler",
    "upcomingTaxes": "Yaklaşan Vergi Tarihleri",
    "exchangeRates": "Döviz Kurları",
    "projectProfitability": "Proje Kârlılığı"
  },
  "invoice": {
    "newInvoice": "Yeni Fatura",
    "invoiceNumber": "Fatura No",
    "client": "Müşteri",
    "issueDate": "Düzenleme Tarihi",
    "dueDate": "Vade Tarihi",
    "items": "Kalemler",
    "description": "Açıklama",
    "quantity": "Miktar",
    "unitPrice": "Birim Fiyat",
    "total": "Toplam",
    "subtotal": "Ara Toplam",
    "taxRate": "KDV Oranı",
    "discount": "İndirim",
    "grandTotal": "Genel Toplam",
    "notes": "Notlar",
    "generatePdf": "PDF Oluştur",
    "status": {
      "draft": "Taslak",
      "sent": "Gönderildi",
      "paid": "Ödendi",
      "overdue": "Gecikmiş",
      "canceled": "İptal"
    }
  },
  "transaction": {
    "addIncome": "Gelir Ekle",
    "addExpense": "Gider Ekle",
    "amount": "Tutar",
    "category": "Kategori",
    "date": "Tarih",
    "project": "Proje",
    "recurring": "Tekrarlayan",
    "receipt": "Fiş/Makbuz"
  },
  "pricing": {
    "title": "Planını Seç",
    "monthly": "Aylık",
    "yearly": "Yıllık",
    "save20": "%20 Tasarruf Et",
    "startFree": "Ücretsiz Başla",
    "subscribe": "Abone Ol",
    "currentPlan": "Mevcut Plan",
    "perMonth": "/ay",
    "perYear": "/yıl",
    "features": "Özellikler",
    "recommended": "Önerilen"
  },
  "common": {
    "save": "Kaydet",
    "cancel": "İptal",
    "delete": "Sil",
    "edit": "Düzenle",
    "search": "Ara",
    "filter": "Filtrele",
    "export": "Dışa Aktar",
    "loading": "Yükleniyor...",
    "noData": "Henüz veri yok",
    "confirm": "Onayla",
    "back": "Geri",
    "next": "İleri",
    "all": "Tümü"
  },
  "tax": {
    "kdv": "KDV Beyannamesi",
    "muhtasar": "Muhtasar Beyanname",
    "geciciVergi": "Geçici Vergi",
    "gelirVergisi": "Gelir Vergisi Beyanı",
    "sgk": "SGK Primi",
    "bagkur": "Bağ-Kur Primi",
    "daysLeft": "gün kaldı",
    "completed": "Tamamlandı",
    "upcoming": "Yaklaşan"
  }
}
```

```json
// public/locales/en/common.json
// Aynı yapıda İngilizce çeviriler...
{
  "app": {
    "name": "FreelancerKit",
    "tagline": "Take control of your freelance business."
  },
  "nav": {
    "dashboard": "Dashboard",
    "income": "Income",
    "expenses": "Expenses",
    "projects": "Projects",
    "invoices": "Invoices",
    "clients": "Clients",
    "calendar": "Tax Calendar",
    "reports": "Reports",
    "settings": "Settings",
    "currency": "Exchange Rates"
  }
  // ... tüm karşılıklar
}
```

---

## 12. OTOMASYON SİSTEMLERİ

### 12.1. Cron Jobs (Docker Cron Container)

```typescript
// scripts/cron.ts
// Docker'da ayrı container olarak çalışır

import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. DÖVİZ KURU GÜNCELLEME — Her gün 06:00 UTC
cron.schedule('0 6 * * *', async () => {
  console.log('[CRON] Exchange rate sync started');
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`
  );
  const data = await response.json();

  if (data.result === 'success') {
    const rates = Object.entries(data.conversion_rates);
    for (const [currency, rate] of rates) {
      await supabase.from('exchange_rates').upsert({
        base_currency: 'USD',
        target_currency: currency,
        rate: rate as number,
        fetched_at: new Date().toISOString(),
      }, { onConflict: 'base_currency,target_currency' });
    }
    console.log(`[CRON] Updated ${rates.length} exchange rates`);
  }
});

// 2. VERGİ HATIRLATMA — Her gün 08:00 UTC
cron.schedule('0 8 * * *', async () => {
  console.log('[CRON] Tax reminder check started');
  const today = new Date();
  const remindDays = [7, 3, 1]; // 7, 3, 1 gün önce bildirim

  for (const days of remindDays) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + days);
    const dateStr = targetDate.toISOString().split('T')[0];

    const { data: reminders } = await supabase
      .from('tax_reminders')
      .select('*, profiles(email, full_name, locale)')
      .eq('due_date', dateStr)
      .eq('is_completed', false)
      .eq('notified', false);

    if (reminders?.length) {
      for (const reminder of reminders) {
        // E-posta gönder (Resend, SendGrid veya Supabase Edge Function)
        await sendTaxReminderEmail(reminder);

        await supabase
          .from('tax_reminders')
          .update({ notified: true })
          .eq('id', reminder.id);
      }
      console.log(`[CRON] Sent ${reminders.length} tax reminders (${days} days before)`);
    }
  }
});

// 3. GECİKMİŞ FATURA KONTROLÜ — Her gün 09:00 UTC
cron.schedule('0 9 * * *', async () => {
  console.log('[CRON] Overdue invoice check started');
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('invoices')
    .update({ status: 'overdue' })
    .eq('status', 'sent')
    .lt('due_date', today);

  if (data) {
    console.log(`[CRON] Marked ${data.length} invoices as overdue`);
  }
});

// 4. TEKRARLAYAN İŞLEM OLUŞTURMA — Her ayın 1'i, 00:00 UTC
cron.schedule('0 0 1 * *', async () => {
  console.log('[CRON] Recurring transactions started');
  const today = new Date();

  const { data: recurring } = await supabase
    .from('transactions')
    .select('*')
    .eq('is_recurring', true);

  if (recurring) {
    for (const tx of recurring) {
      // Yeni ay için kopyasını oluştur
      const { id, created_at, updated_at, ...rest } = tx;
      await supabase.from('transactions').insert({
        ...rest,
        date: today.toISOString().split('T')[0],
      });
    }
    console.log(`[CRON] Created ${recurring.length} recurring transactions`);
  }
});

// 5. TEKRARLAYAN VERGİ HATIRLATMALARInı OLUŞTUR — Her ayın 1'i
cron.schedule('0 1 1 * *', async () => {
  console.log('[CRON] Generating recurring tax reminders');
  // Tamamlanmış ve tekrarlayan hatırlatmalar için bir sonraki dönem oluştur
  const { data: completed } = await supabase
    .from('tax_reminders')
    .select('*')
    .eq('is_completed', true)
    .eq('is_recurring', true);

  if (completed) {
    for (const reminder of completed) {
      const nextDue = calculateNextDueDate(reminder.due_date, reminder.recurring_interval);
      const nextReminder = new Date(nextDue);
      nextReminder.setDate(nextReminder.getDate() - 7);

      await supabase.from('tax_reminders').insert({
        user_id: reminder.user_id,
        title: reminder.title,
        description: reminder.description,
        due_date: nextDue,
        reminder_date: nextReminder.toISOString().split('T')[0],
        type: reminder.type,
        country: reminder.country,
        is_recurring: true,
        recurring_interval: reminder.recurring_interval,
        is_completed: false,
        notified: false,
      });
    }
  }
});

console.log('[CRON] All cron jobs scheduled');
```

### 12.2. Otomatik İşlemler Özeti

| Otomasyon | Zamanlama | Açıklama |
|---|---|---|
| Döviz kuru senkronizasyon | Her gün 06:00 | exchangerate-api → Supabase |
| Vergi hatırlatma | Her gün 08:00 | 7/3/1 gün önce e-posta |
| Gecikmiş fatura kontrolü | Her gün 09:00 | sent → overdue otomatik |
| Tekrarlayan işlem oluşturma | Her ayın 1'i | Aylık tekrarlayan gelir/gider |
| Tekrarlayan vergi hatırlatma | Her ayın 1'i | Tamamlanan hatırlatmalar için sonraki ay |
| Fatura numarası otomatik artış | Her fatura oluşturmada | FK-YYYY-NNNN formatı |
| Kur kaydı | Her işlem oluşturmada | Anlık kuru transaction'a yaz |
| Para birimi çevrimi | Her işlem oluşturmada | amount_in_base hesapla |

---

## 13. GÜVENLİK

```
1. AUTHENTICATION
   - Supabase Auth (JWT)
   - E-posta doğrulama zorunlu
   - Şifre politikası: min 8 karakter
   - Google OAuth opsiyonel

2. AUTHORIZATION
   - Supabase RLS tüm tablolarda aktif
   - API route'larda auth middleware
   - Plan bazlı özellik kontrolü (server-side)

3. INPUT VALIDATION
   - Zod ile tüm form validasyonları
   - Server-side validation (API routes)
   - SQL injection koruması (Supabase parameterized queries)

4. WEBHOOK GÜVENLİĞİ
   - Lemon Squeezy: HMAC SHA-256 imza doğrulama
   - İmza uyuşmazlığında 401 döndür

5. RATE LIMITING
   - API route'larda rate limiting (next-rate-limit veya upstash)
   - Exchange rate API: günde max 50 istek

6. ENVIRONMENT VARIABLES
   - Tüm secretlar .env dosyasında
   - NEXT_PUBLIC_ prefix sadece frontend değişkenleri
   - Docker secrets kullanımı (production)

7. HEADERS
   - Nginx: X-Frame-Options, X-Content-Type-Options, CSP
   - Next.js: security headers config

8. DATA
   - Hassas veriler encrypt edilebilir (opsiyonel)
   - Supabase backup: günlük otomatik
```

---

## 14. ENV DEĞİŞKENLERİ

```env
# .env.local.example

# === SUPABASE ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# === LEMON SQUEEZY ===
LEMON_SQUEEZY_API_KEY=your-ls-api-key
LEMON_SQUEEZY_WEBHOOK_SECRET=your-webhook-secret
LEMON_SQUEEZY_STORE_ID=your-store-id

# Lemon Squeezy Variant IDs
NEXT_PUBLIC_LS_BASIC_MONTHLY_TR=variant_id
NEXT_PUBLIC_LS_BASIC_YEARLY_TR=variant_id
NEXT_PUBLIC_LS_BASIC_MONTHLY_EN=variant_id
NEXT_PUBLIC_LS_BASIC_YEARLY_EN=variant_id
NEXT_PUBLIC_LS_PRO_MONTHLY_TR=variant_id
NEXT_PUBLIC_LS_PRO_YEARLY_TR=variant_id
NEXT_PUBLIC_LS_PRO_MONTHLY_EN=variant_id
NEXT_PUBLIC_LS_PRO_YEARLY_EN=variant_id

# === EXCHANGE RATE ===
EXCHANGE_RATE_API_KEY=your-exchange-rate-api-key

# === APP ===
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_DEFAULT_LOCALE=tr

# === DOCKER / SERVER ===
SERVER_HOST=your-server-ip
SERVER_USER=your-ssh-user
```

---

## 15. GELİŞTİRME ADIMLARI (CLAUDE CODE İÇİN SIRALI)

Claude Code ile bu projeyi aşağıdaki sırayla geliştir:

### FAZE 1 — Temel Altyapı (Gün 1-2)
```
1. Next.js projesi oluştur (App Router, TypeScript, Tailwind)
2. Tailwind config: custom renk paleti, fontlar, animasyon tokenları
3. Supabase bağlantısı: client, server, admin
4. Auth sistemi: login, register, forgot-password sayfaları
5. Middleware: auth kontrolü + i18n routing
6. next-intl kurulumu: TR/EN çeviri dosyaları
7. Temel layout: Sidebar + Topbar + sayfa geçiş animasyonu
8. Temel UI bileşenleri: Button, Input, Card, Modal, Table, Toast
```

### FAZE 2 — Veritabanı & API (Gün 3-4)
```
1. Supabase migration dosyaları: tüm tablolar
2. RLS policies
3. Database fonksiyonları (kârlılık, aylık özet)
4. Supabase types generate (TypeScript tipleri)
5. API routes: CRUD operasyonları
6. Zod validasyon şemaları
```

### FAZE 3 — Dashboard & İşlemler (Gün 5-7)
```
1. Dashboard sayfası: stat kartları, grafikler, son işlemler
2. Recharts entegrasyonu: gelir/gider çizgi grafik, kârlılık bar chart
3. CountUp animasyonu: rakamlar
4. Gelir/Gider CRUD: form, liste, filtreleme
5. Kategori yönetimi
6. Fiş yükleme (Supabase Storage)
```

### FAZE 4 — Projeler & Müşteriler (Gün 8-9)
```
1. Müşteri CRUD: form, liste, detay
2. Proje CRUD: form, liste, detay
3. Proje kârlılık analizi sayfası
4. Proje-müşteri ilişkilendirme
```

### FAZE 5 — Faturalar (Gün 10-12)
```
1. Fatura formu: kalem ekleme, KDV, indirim hesaplama
2. Canlı önizleme bileşeni
3. @react-pdf/renderer ile PDF şablonu
4. PDF oluşturma API route
5. Fatura durumu yönetimi
6. Otomatik fatura numarası
```

### FAZE 6 — Vergi Takvimi (Gün 13-14)
```
1. Vergi takvimi sayfası: takvim görünümü
2. TR vergi tarihleri varsayılan olarak
3. Global vergi tarihleri (ülkeye göre)
4. Özel hatırlatma ekleme
5. Tamamlandı işaretleme
```

### FAZE 7 — Döviz & Ödeme (Gün 15-17)
```
1. Exchange rate API entegrasyonu
2. Döviz widget bileşeni
3. Para birimi çevrimi (işlemlerde)
4. Lemon Squeezy entegrasyonu
5. Webhook handler
6. Plan bazlı özellik kilitleme
7. Fiyatlandırma sayfası
8. Settings > Billing sayfası
```

### FAZE 8 — Raporlama & Pro Özellikler (Gün 18-19)
```
1. Rapor sayfası: filtreler, grafikler
2. PDF rapor export
3. CSV export
4. Gelişmiş döviz kuru sayfası (kur geçmişi)
```

### FAZE 9 — Landing Page (Gün 20-21)
```
1. Hero section: animasyonlu, çarpıcı
2. Features section: özellik kartları
3. Pricing section: 3 plan kartı
4. Testimonials (mock data)
5. Footer
6. Responsive tasarım kontrolü
```

### FAZE 10 — Docker & Deploy (Gün 22-23)
```
1. Dockerfile oluştur
2. docker-compose.yml
3. Nginx config
4. SSL (Let's Encrypt)
5. GitHub Actions CI/CD
6. Cron container
7. Production test
```

### FAZE 11 — Son Kontroller (Gün 24-25)
```
1. Responsive kontrol (mobil, tablet, desktop)
2. Performans optimizasyonu (lazy loading, code splitting)
3. SEO: meta tags, OpenGraph
4. Error boundaries
5. 404 ve error sayfaları
6. Loading states ve skeleton
7. Erişilebilirlik (a11y) kontrol
8. Son test ve bug fix
```

---

## 16. LANDING PAGE TASARIM NOTALARI

```
HERO SECTION:
- Tam ekran, koyu arka plan
- Büyük başlık: font-extrabold, tracking-tight, text-5xl
- Alt başlık: text-secondary, text-lg
- CTA butonları: "Ücretsiz Başla" (accent bg) + "Demo İzle" (ghost)
- Arka planda: subtle grid pattern veya gradient mesh
- Scroll indicator: aşağı ok animasyonu

FEATURES SECTION:
- 3 veya 6 özellik kartı (grid)
- Her kartta: ikon (Lucide) + başlık + kısa açıklama
- Scroll-triggered giriş animasyonu (staggered)

PRICING SECTION:
- Section 7.2'deki tasarım
- Toggle: aylık/yıllık
- Pro kart: ön planda, accent border, glow

TESTIMONIALS:
- 3 kullanıcı yorumu (mock)
- Avatar + isim + ülke
- Carousel veya grid

FOOTER:
- Logo + navigasyon linkleri
- Sosyal medya ikonları
- "Made with ♥ by [Senin Adın]"
- Dil değiştirici
```

---

## 17. NOTLAR VE KURALLAR

```
KODLAMA KURALLARI:
- TypeScript strict mode
- ESLint + Prettier
- Component'lar fonksiyonel (arrow function + default export)
- Hooks: use prefix
- Dosya isimlendirme: PascalCase (component), camelCase (util/hook)
- CSS: Tailwind utility-first, custom class minimum
- Tüm metinler i18n üzerinden (hardcode metin yasak)
- Console.log kaldır (production'da)
- Error handling her API çağrısında

PERFORMANS:
- Image optimization: next/image
- Dynamic import: lazy loading (heavy components)
- Recharts: lazy import
- React-PDF: dynamic import (SSR yok)
- Supabase: sadece gerekli alanları select et
- Pagination: server-side (limit/offset)

RESPONSIVE:
- Mobile-first yaklaşım
- Breakpoints: sm(640) md(768) lg(1024) xl(1280)
- Sidebar: mobilde hamburger menu (drawer)
- Tablolar: mobilde card view'a dönüşüm
- Touch-friendly: min 44px tap target

SUPABASE:
- Tüm CRUD işlemleri hook'lar üzerinden
- Optimistic updates (UI hızı için)
- Real-time subscription sadece gerekli yerlerde
- Error handling + toast bildirim
```

---

## 18. ÖNCELİK SIRASI (MVP → Full)

```
MVP (İlk çıkış):
✅ Auth (login/register)
✅ Dashboard (temel stat kartlar + grafik)
✅ Gelir/Gider takibi (CRUD)
✅ Proje yönetimi (basit CRUD)
✅ Fatura oluşturma (PDF)
✅ TR/EN dil desteği
✅ Landing page + Pricing
✅ Lemon Squeezy ödeme
✅ Docker deploy

V1.1:
- Vergi takvimi (TR)
- Müşteri yönetimi
- Döviz kuru entegrasyonu
- Tekrarlayan işlemler

V1.2:
- Raporlama (Pro)
- CSV/PDF export
- Fiş yükleme
- Global vergi takvimleri

V2.0:
- Zaman takibi (time tracking)
- Teklif (proposal) oluşturma
- Müşteri portalı
- API erişimi (Pro)
- Mobil uygulama (React Native)
```

---

**Bu dosyayı Claude Code'a ver ve "Bu spesifikasyona göre projeyi Faze 1'den başlayarak adım adım oluştur" de.**

**Her faz tamamlandığında bir sonrakine geç. Sorun yaşarsan ilgili bölümü referans göster.**
