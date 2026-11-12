<div align="center">

<img src="docs/media/hero.svg" alt="Freelora — finance management for freelancers" width="100%">

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-App%20Router-34d399?style=for-the-badge&labelColor=080b0a">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-auth%20%2B%20data-fbbf24?style=for-the-badge&labelColor=080b0a">
  <img alt="react-pdf" src="https://img.shields.io/badge/invoices-PDF-60a5fa?style=for-the-badge&labelColor=080b0a">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-34d399?style=for-the-badge&labelColor=080b0a">
</p>

<p><em>A minimalist, premium finance tool for freelancers and small businesses:<br>
invoices, irregular income, project profitability, tax reminders and multiple currencies.</em></p>

</div>

<img src="docs/media/divider.svg" width="100%" alt="">

## Features

| | |
|---|---|
| **Invoices** | PDF generation, email delivery and status tracking (draft, sent, paid). |
| **Income and expenses** | Categorised transactions, recurring entries and receipt uploads. |
| **Dashboard** | A live income summary, project profitability and a currency widget. |
| **Clients** | Profiles with invoice history. |
| **Projects** | Profitability per project, budget versus actual. |
| **Tax calendar** | Turkish, US and German deadlines with reminders 7, 3 and 1 day before. |
| **Currencies** | Daily exchange rates with USD-based multi-currency support. |
| **Export** | Excel-friendly CSV with BOM. |
| **Command palette** | <kbd>⌘</kbd> <kbd>K</kbd> navigation. |
| **Onboarding** | A four-step setup that seeds tax dates for your country. |
| **TR / EN** | Turkish by default, English available; Google sign-in. |

```mermaid
flowchart LR
  U[Freelancer] --> APP[Next.js dashboard]
  APP <--> SB[(Supabase · RLS)]
  APP --> PDF[react-pdf invoices] --> MAIL[Resend]
  CRON[node-cron<br/>FX rates · tax reminders] --> SB
  CRON --> MAIL
```

<img src="docs/media/divider.svg" width="100%" alt="">

## Türkçe özet

**Freelora**, serbest çalışanlar ve küçük işletmeler için sade ve şık bir finans yönetim aracı. Fatura oluşturup PDF olarak gönderme, gelir-gider takibi, proje bazlı kârlılık, Türkiye/ABD/Almanya vergi takvimi ve hatırlatmaları, günlük döviz kurlarıyla çoklu para birimi desteği sunuyor. Arayüz varsayılan olarak Türkçe; Supabase ve Google ile giriş yapılıyor.

<img src="docs/media/divider.svg" width="100%" alt="">

## Development

```sh
npm install
cp .env.example .env.local   # Supabase, Resend, FX provider
npm run dev                  # http://localhost:3000
npm run cron                 # FX rates and tax reminders
npm run type-check
```

A Docker setup is included in `docker/` for self-hosting.

<div align="center">
<br>
<a href="https://github.com/kutluhangil"><img src="docs/media/signature.svg" width="100%" alt="Built by kutluhangil"></a>
<sub>Irregular income, regular clarity.</sub>
</div>
