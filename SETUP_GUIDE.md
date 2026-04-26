# Freelora — Manuel Kurulum Kılavuzu

Bu dosya, uygulamayı çalıştırabilmek için yapılması gereken **harici servis kurulumlarını** adım adım açıklar. Kod yazmak gerekmez; hesap açma, key kopyalama ve dashboard ayarları.

---

## 1. Supabase Projesi

### 1.1. Proje Oluştur
1. [supabase.com](https://supabase.com) → "New project"
2. Proje adı: `freelora` (veya istediğin isim)
3. Şifre: güçlü bir şifre belirle ve kaydet
4. Bölge: `eu-central-1` (Frankfurt) — TR kullanıcılar için önerilir

### 1.2. API Anahtarları
Proje oluşunca: **Settings → API**
```
NEXT_PUBLIC_SUPABASE_URL     = Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY = anon / public
SUPABASE_SERVICE_ROLE_KEY    = service_role (GİZLİ — hiç paylaşma)
```

### 1.3. Veritabanı Migration'larını Çalıştır
**SQL Editor** sekmesine git, aşağıdaki dosyaları sırayla yapıştır ve çalıştır:

| Sıra | Dosya | Açıklama |
|---|---|---|
| 1 | `supabase/migrations/001_initial_schema.sql` | Tablolar ve indexler |
| 2 | `supabase/migrations/002_rls_policies.sql` | Güvenlik politikaları |
| 3 | `supabase/migrations/003_functions.sql` | Veritabanı fonksiyonları |
| 4 | `supabase/migrations/004_triggers.sql` | Tetikleyiciler |
| 5 | `supabase/migrations/005_seed.sql` | Başlangıç döviz kurları |
| 6 | `supabase/migrations/006_onboarding.sql` | Onboarding kolonu |
| 7 | `supabase/migrations/007_storage.sql` | Fiş yükleme bucket'ı |
| 8 | `supabase/migrations/008_time_entries.sql` | Zaman takibi tablosu |
| 9 | `supabase/migrations/009_proposals.sql` | Teklifler tablosu |
| 10 | `supabase/migrations/010_client_portal.sql` | Müşteri portal token'ı |
| 11 | `supabase/migrations/011_overdue_reminders.sql` | Gecikmiş fatura takibi |

### 1.4. Google OAuth (isteğe bağlı)
**Authentication → Providers → Google**
1. Google Cloud Console → yeni OAuth 2.0 client
2. Authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
3. Client ID ve Secret'ı Supabase'e yapıştır
4. Enable et

### 1.5. E-posta Şablonlarını Özelleştir (isteğe bağlı)
**Authentication → Email Templates**
- "Confirm signup" şablonunu Freelora markasına göre düzenleyebilirsin
- Logo ve renkler için HTML düzenle

---

## 2. Lemon Squeezy (Ödeme Sistemi)

### 2.1. Hesap ve Store
1. [lemonsqueezy.com](https://www.lemonsqueezy.com) → kayıt ol
2. **Stores** → "Create store" → isim: "Freelora"
3. Store ID'yi not al → `NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID`

### 2.2. API Anahtarı
**Settings → API** → "Create API key"
```
LEMON_SQUEEZY_API_KEY = oluşturduğun key
```

### 2.3. Ürünler Oluştur
**Products → New product** → "Subscription"

**Ürün 1: Freelora Basic**
| Varyant | Fiyat | Billing |
|---|---|---|
| Basic Monthly | ₺249 veya $14 | Monthly |
| Basic Yearly | ₺2390 veya $134 | Yearly |

**Ürün 2: Freelora Pro**
| Varyant | Fiyat | Billing |
|---|---|---|
| Pro Monthly | ₺699 veya $39 | Monthly |
| Pro Yearly | ₺6710 veya $374 | Yearly |

Her varyant oluşturduktan sonra **Variant ID**'lerini not al:
```
NEXT_PUBLIC_LS_BASIC_MONTHLY = 111111
NEXT_PUBLIC_LS_BASIC_YEARLY  = 222222
NEXT_PUBLIC_LS_PRO_MONTHLY   = 333333
NEXT_PUBLIC_LS_PRO_YEARLY    = 444444
```

### 2.4. Webhook Kur
**Settings → Webhooks → Add webhook**
- **URL:** `https://senindomain.com/api/webhooks/lemon-squeezy`
- **Events:** Aşağıdakilerin hepsini seç:
  - `subscription_created`
  - `subscription_updated`
  - `subscription_cancelled`
  - `subscription_payment_success`
  - `subscription_payment_failed`
- **Signing secret:** Oluşturulan secret'ı kopyala
```
LEMON_SQUEEZY_WEBHOOK_SECRET = kopyaladığın secret
```

### 2.5. Checkout'ta User ID Geçir
Uygulama checkout URL'sini `src/lib/lemon-squeezy/client.ts` üzerinden oluşturur.
Lemon Squeezy panelinde **Checkout → Custom data** alanına `user_id` field'ını ekle.

---

## 3. Resend (E-posta)

### 3.1. Hesap ve API Key
1. [resend.com](https://resend.com) → kayıt ol
2. **API Keys → Create API Key** → "Freelora" ismiyle
```
RESEND_API_KEY = re_xxxxxxxxxxxx
```

### 3.2. Domain Doğrula (üretim için zorunlu)
**Domains → Add domain** → `freelora.app` veya kendi domain'in
- DNS kayıtlarını domain sağlayıcına ekle (SPF, DKIM, DMARC)
- Doğrulama 10-30 dk sürebilir

### 3.3. Gönderici E-posta Ayarla
`.env.local` dosyasına ekle:
```
RESEND_FROM_EMAIL = Freelora <noreply@senindomain.com>
```

> ⚠️ Domain doğrulayana kadar Resend sadece `resend.dev` üzerinden gönderim yapar.
> Geliştirme ortamında `onboarding@resend.dev` gibi test adresleri kullanabilirsin.

---

## 4. exchangerate-api.com (Döviz Kuru)

### 4.1. API Key Al
1. [exchangerate-api.com](https://www.exchangerate-api.com) → "Get Free Key"
2. E-posta doğrula
3. Dashboard'dan API key'i kopyala:
```
EXCHANGE_RATE_API_KEY = xxxxxxxxxxxxxxxxxxxxxxxx
```

> Free plan: 1.500 istek/ay. Uygulama günde 1 istek yapıyor → **aylık ~30 istek** = yeterli.

---

## 5. Cron Güvenliği

Cron route'larını korumak için rastgele bir secret oluştur:

```bash
# Terminal'de çalıştır:
openssl rand -hex 32
```

Çıktıyı `.env.local`'e ekle:
```
CRON_SECRET = oluşturulan_rastgele_string
```

Cron job'ları tetiklemek için (örnek):
```bash
# Döviz kurunu manuel güncelle:
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://senindomain.com/api/cron/exchange-sync

# Vergi hatırlatmalarını test et:
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://senindomain.com/api/cron/tax-reminders
```

---

## 6. Docker ile Deploy (Sunucu)

### 6.1. Sunucu Gereksinimleri
- Ubuntu 22.04 LTS
- En az 2 GB RAM, 2 vCPU
- Docker + Docker Compose kurulu

### 6.2. Sunucuya Bağlan ve Klonla
```bash
ssh user@sunucu_ip
git clone https://github.com/kutluhangil/Freelora.git
cd Freelora
```

### 6.3. Environment Dosyasını Oluştur
```bash
cp .env.example .env.production
nano .env.production
# Tüm değişkenleri doldur
```

### 6.4. Nginx Config'ini Düzenle
`docker/nginx/default.conf` dosyasında `${DOMAIN}` yerine gerçek domain adını yaz.

### 6.5. SSL Sertifikası Al (İlk Kez)
```bash
# Önce nginx'i HTTP moduyla başlat
docker compose -f docker/docker-compose.yml up -d nginx

# Sertifikayı al
docker compose -f docker/docker-compose.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email senin@email.com \
  --agree-tos --no-eff-email \
  -d senindomain.com

# Tam stack'i başlat
docker compose -f docker/docker-compose.yml up -d
```

### 6.6. Otomatik SSL Yenileme
Certbot her 12 saatte kendini kontrol eder. Ek bir şey yapman gerekmez.

---

## 7. GitHub Actions CI/CD

### 7.1. SSH Key Oluştur
```bash
# Localden çalıştır:
ssh-keygen -t ed25519 -C "freelora-deploy" -f ~/.ssh/freelora_deploy
# Passphrase: boş bırak

# Public key'i sunucuya ekle:
ssh-copy-id -i ~/.ssh/freelora_deploy.pub user@sunucu_ip
```

### 7.2. GitHub Secrets Ekle
GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Değer |
|---|---|
| `SSH_HOST` | Sunucu IP adresi |
| `SSH_USER` | SSH kullanıcı adı (ör: ubuntu) |
| `SSH_KEY` | `~/.ssh/freelora_deploy` dosyasının **tüm içeriği** |
| `SSH_PORT` | `22` (varsayılan) |
| `APP_DIR` | Sunucudaki proje dizini (ör: `/home/ubuntu/Freelora`) |

### 7.3. Test Et
`main` branch'e herhangi bir commit push et → **Actions** sekmesinden deploy'u izle.

---

## 8. Open Graph Resmi

`/public/og.png` dosyası yok — SEO için oluşturman gerekiyor.

**Önerilen boyut:** 1200×630 px

Hızlı oluşturmak için:
- [og-image.vercel.app](https://og-image.vercel.app)
- Figma veya Canva
- İçerik: "Freelora" logosu + slogan + koyu arka plan

Oluşturduktan sonra `/Volumes/ProjectVault/Freelora/Freelora/public/og.png` olarak kaydet.

---

## 9. Supabase Yedekleme

Supabase Pro plan ile otomatik günlük yedek alır. Free plan için:

```bash
# Manuel yedek (cron'a eklenebilir):
pg_dump "postgresql://postgres:ŞIFRE@db.PROJE_ID.supabase.co:5432/postgres" > backup_$(date +%Y%m%d).sql
```

Bağlantı bilgileri: Supabase → **Settings → Database → Connection string**

---

## 10. Sonraki Adımlar (V2 Yol Haritası)

Şu an uygulamada olmayan, ilerleyen sürümlerde eklenebilecekler:

- [ ] **Raporlar sayfası** — Gelişmiş grafikler, PDF/CSV export (Pro plan)
- [ ] **Zaman takibi** — Proje bazlı saat takibi, Toggl entegrasyonu
- [ ] **Teklif (Proposal)** — Fatura öncesi teklif oluşturma
- [ ] **Müşteri portalı** — Müşterilerin kendi faturalarını görmesi
- [ ] **Mobil uygulama** — React Native ile iOS/Android
- [ ] **Banka entegrasyonu** — Otomatik işlem içe aktarma

---

*Bu kılavuz `SETUP_GUIDE.md` olarak proje kökünde bulunur. Her zaman güncel tutmaya çalış.*
