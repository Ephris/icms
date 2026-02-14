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
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the entire contents of `supabase/schema.sql` into the SQL Editor
4. Click **Run** to execute the SQL (this creates tables, policies, and triggers)
5. Copy your project URL and anon key from **Settings > API**
6. Add them to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
7. Enable **Email Auth** in Authentication > Providers > Email
8. For Vercel deployment, add the same environment variables in Vercel project settings

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
