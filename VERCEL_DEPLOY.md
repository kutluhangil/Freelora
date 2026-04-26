# Freelora — Vercel Deploy Kılavuzu

---

## Adım 1 — GitHub'a Push Et

```bash
cd /Volumes/ProjectVault/Freelora/Freelora

git init
git remote add origin https://github.com/kutluhangil/Freelora.git
git add .
git commit -m "feat: initial Freelora release"
git branch -M main
git push -u origin main
```

> Repo zaten bağlıysa sadece `git add . && git commit -m "..." && git push` yeterli.

---

## Adım 2 — Vercel'de Proje Oluştur

1. [vercel.com](https://vercel.com) → giriş yap
2. **Add New → Project**
3. GitHub reposunu bul: `kutluhangil/Freelora` → **Import**
4. Framework: **Next.js** (otomatik algılanır)
5. Root Directory: **boş bırak**
6. **Henüz Deploy etme** — önce environment variables'ları ekle (Adım 3)

---

## Adım 3 — Environment Variables

Vercel → Project → **Settings → Environment Variables** altına aşağıdaki değişkenleri ekle.  
Her birini **Production + Preview + Development** ortamları için işaretle.

### Supabase

| Key | Değer |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → **anon / public** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → **service_role** (gizli tut) |

### Uygulama

| Key | Değer |
|-----|-------|
| `NEXT_PUBLIC_APP_URL` | `https://freelora.vercel.app` (ya da custom domain'in) |

### Resend (E-posta)

| Key | Değer |
|-----|-------|
| `RESEND_API_KEY` | Resend → API Keys → oluşturduğun key (`re_xxx...`) |
| `RESEND_FROM_EMAIL` | `Freelora <noreply@freelora.app>` |

### Lemon Squeezy (Ödeme)

| Key | Değer |
|-----|-------|
| `LEMON_SQUEEZY_API_KEY` | LS → Settings → API → API key |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | LS → Settings → Webhooks → signing secret |
| `NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID` | LS → Stores → Store ID |
| `NEXT_PUBLIC_LS_BASIC_MONTHLY` | Basic Aylık varyant ID |
| `NEXT_PUBLIC_LS_BASIC_YEARLY` | Basic Yıllık varyant ID |
| `NEXT_PUBLIC_LS_PRO_MONTHLY` | Pro Aylık varyant ID |
| `NEXT_PUBLIC_LS_PRO_YEARLY` | Pro Yıllık varyant ID |

### Döviz Kuru

| Key | Değer |
|-----|-------|
| `EXCHANGE_RATE_API_KEY` | exchangerate-api.com → Dashboard → API key |

### Cron Güvenliği

| Key | Değer |
|-----|-------|
| `CRON_SECRET` | **Elle girme** — Vercel otomatik oluşturur ve yönetir |

---

## Adım 4 — İlk Deploy

Tüm değişkenler eklendikten sonra:

Vercel → Project → **Deployments → Redeploy** (veya ilk defa deploy et butonu)

Build ~2 dakika sürer. Hata çıkarsa Vercel → **Deployments → Build Logs** bölümünden incele.

---

## Adım 5 — Supabase'i Güncelle

Vercel deploy tamamlandıktan sonra Supabase paneline dön:

**Authentication → URL Configuration**

| Alan | Değer |
|------|-------|
| Site URL | `https://freelora.vercel.app` |
| Redirect URLs | `https://freelora.vercel.app/api/auth/callback` |

> Custom domain bağlarsan bu adımı tekrar yap.

---

## Adım 6 — Lemon Squeezy Webhook URL'ini Güncelle

LS → **Settings → Webhooks** → mevcut webhook'u düzenle:

```
https://freelora.vercel.app/api/webhooks/lemon-squeezy
```

---

## Adım 7 — Custom Domain Bağla (isteğe bağlı)

1. Vercel → Project → **Settings → Domains** → `freelora.app` ekle
2. Vercel sana iki DNS kaydı gösterir:
   - `A` kaydı: `@` → `76.76.21.21`
   - `CNAME` kaydı: `www` → `cname.vercel-dns.com`
3. Bu kayıtları domain sağlayıcında (GoDaddy, Namecheap vb.) ekle
4. Propagasyon 5–30 dakika sürebilir
5. Domain bağlandıktan sonra `NEXT_PUBLIC_APP_URL` değerini güncelle → **Redeploy**

---

## Cron Job'lar

`vercel.json` içinde tanımlı. Vercel otomatik olarak çalıştırır:

| Zamanlama | Route | Görev |
|-----------|-------|-------|
| Her gün 06:00 UTC | `/api/cron/exchange-sync` | Döviz kurlarını güncelle |
| Her gün 08:00 UTC | `/api/cron/tax-reminders` | Vergi hatırlatma e-postası gönder |

> Vercel **Hobby** planda cron'lar günde 1 kez çalışabilir — bu uygulama için yeterli.  
> **Pro** plana geçersen saatlik çalıştırabilirsin.

---

## Sorun Giderme

| Hata | Çözüm |
|------|-------|
| Build hatası: `supabaseUrl is required` | `NEXT_PUBLIC_SUPABASE_URL` env var eksik |
| Build hatası: `Missing API key` (Resend) | `RESEND_API_KEY` env var eksik |
| Login sonrası yönlendirme çalışmıyor | Supabase Redirect URL güncellenmemiş (Adım 5) |
| Ödeme webhook çalışmıyor | LS webhook URL güncellenmemiş (Adım 6) |
| Cron job çalışmıyor | Vercel → Project → Settings → Cron Jobs sekmesini kontrol et |

---

*Genel kurulum kılavuzu için [SETUP_GUIDE.md](SETUP_GUIDE.md) dosyasına bak.*
