# TrustMarket MVP

A launch-ready digital products marketplace built with Next.js 14 App Router, Supabase, Tailwind CSS, and PayPal.

## MVP Features
- Supabase Auth signup/login/logout
- Public marketplace with product grid, search, and category filter
- Product detail pages with description, ratings/reviews, and buy flow
- Seller dashboard for upload, edit, delete, and sales overview
- Secure digital file uploads in Supabase Storage bucket: `products`
- PayPal checkout (create order → approve → capture → persist order → unlock download)
- Trust pages: About, Contact, Privacy Policy, Terms, Refund Policy
- Vercel-friendly setup

## Stack
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (Postgres, Auth, Storage)
- PayPal REST Checkout

## Local Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables
Set these in `.env.local` and Vercel:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

## Supabase Setup
1. Create a Supabase project.
2. Run `db/schema.sql` in Supabase SQL editor.
3. Create storage bucket `products`.
4. Enable email/password auth provider.
5. Add storage + table RLS policies from the schema.

## PayPal Setup
- Use sandbox credentials for development.
- `PAYPAL_BASE_URL` sandbox value: `https://api-m.sandbox.paypal.com`
- Production value: `https://api-m.paypal.com`

## Deployment (Vercel)
1. Push to GitHub.
2. Import project in Vercel.
3. Add all env vars from `.env.example`.
4. Deploy.
5. Add your Vercel domain to Supabase auth redirect URLs.
