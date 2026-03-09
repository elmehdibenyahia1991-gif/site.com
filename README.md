# TrustMarket MVP (Gumroad/Payhip-style)

Production-ready startup MVP for a digital products marketplace using Next.js 14, Supabase, and PayPal.

## Features
- Email/password auth with Supabase Auth (signup/login/logout)
- Public marketplace with search, category filtering, and best-sellers section
- Product details page with ratings + reviews + checkout CTA
- Seller dashboard with product uploads, product deletion, sales, and revenue snapshots
- Admin panel with platform stats, user list, product monitoring, and product removal
- PayPal order create/approve/capture flow + order persistence
- Secure post-purchase download URL generation
- Trust pages: About, Contact, FAQ, Privacy, Terms, Refund
- Affordable pricing UX + optional bundle pricing on each product

## Project Structure

```txt
app/
  api/
    admin/products/[id]/route.ts
    auth/logout/route.ts
    download/route.ts
    orders/route.ts
    paypal/create-order/route.ts
    paypal/capture-order/route.ts
    products/route.ts
    products/[id]/route.ts
    reviews/route.ts
  about/page.tsx
  admin/page.tsx
  checkout/[id]/page.tsx
  checkout/[id]/success/page.tsx
  contact/page.tsx
  dashboard/seller/page.tsx
  dashboard/seller/upload/page.tsx
  faq/page.tsx
  login/page.tsx
  marketplace/page.tsx
  privacy/page.tsx
  product/[id]/page.tsx
  refund/page.tsx
  signup/page.tsx
  terms/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  auth-form.tsx
  product-card.tsx
  review-form.tsx
lib/
  paypal.ts
  supabase-admin.ts
  supabase-client.ts
  supabase-server.ts
  types.ts
db/schema.sql
```

## Environment Variables
Create `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox
```

## Supabase Setup Guide
1. Create a Supabase project.
2. Open SQL editor and run `db/schema.sql`.
3. In Storage, create bucket named `products`.
4. Add storage policies so only authenticated users can upload, and downloads are served through signed URLs.
5. In Project Settings > API, copy `Project URL`, `anon key`, and `service_role key` into `.env.local`.
6. In Auth settings, enable email/password provider.
7. Create one admin user by updating `public.users.role = 'admin'` for your account.

## PayPal Setup Guide
1. Create a PayPal developer account: https://developer.paypal.com/
2. Create a Sandbox app.
3. Copy `Client ID` and `Secret` into `.env.local`.
4. Keep `PAYPAL_MODE=sandbox` for tests.
5. Checkout flow:
   - Client calls `/api/paypal/create-order`
   - User approves on PayPal
   - PayPal redirects to `/checkout/[id]/success?token=...`
   - Client calls `/api/paypal/capture-order`
   - Order is stored in `orders`
   - Client calls `/api/download` for secure file URL
6. For production, switch to Live app credentials + `PAYPAL_MODE=live` and update callback URLs.

## Run Locally
```bash
npm install
npm run dev
```

## Vercel Deployment Guide
1. Push this repository to GitHub.
2. Import repository in Vercel.
3. Add all environment variables from `.env.local`.
4. Deploy.
5. In Supabase Auth URL settings, add your Vercel domain.
6. In PayPal app settings, set live return/cancel URLs to your Vercel domain.

## Security Notes
- Digital file downloads require a paid order (`orders` table check).
- Download links are signed and expire in 60 seconds.
- Use Supabase RLS policies from `db/schema.sql`.
- Keep service role key server-only.
