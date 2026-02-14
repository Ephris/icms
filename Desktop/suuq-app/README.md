# Suuq Soomaaliyeed — The Global Somali Business Hub

A free peer-to-peer marketplace for the Somali community worldwide. Sellers list products, buyers call directly and arrange pickup. No payment processing, no delivery system — just community commerce.

## Quick Start

```bash
# Install dependencies
yarn install

# Copy environment file and add your Supabase keys
cp .env.local.example .env.local

# Run development server
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Demo Mode**: The app works without Supabase using sample data. Add your Supabase keys to enable real accounts and listings.

## Setting Up Supabase (Production)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Copy your project URL and anon key to `.env.local`
4. Enable **Email Auth** in Authentication > Providers

## Deploy to Vercel

```bash
yarn run build
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

## Tech Stack

- **Next.js 14** — React framework with App Router
- **Tailwind CSS** — Utility-first styling
- **Supabase** — Auth, PostgreSQL database, image storage
- **Lucide React** — Icons

## Cities

Mogadishu, Hargaysa, Bosaso, Burco, Garowe, Galkacyo, Kismayu, Lascanood, Jijiga, Wajeer, Mandera, Garissa, Dubai, Guangzhou, Yiwu

## Categories

Electronics, Vehicles, Fashion, Livestock, Real Estate, Food & Groceries, Furniture, Health & Beauty, Services, Agriculture, Construction, Sports, Education, Wholesale & Import, Other
