# Industrial Automation storefront

This project is a Next.js App Router commerce site backed by PostgreSQL and Prisma. It retains customer/admin accounts, catalog and variant management, the cart, checkout, order management, support chat, and PayPal/Razorpay payment routes.

## Setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env` and set database, authentication, payment, email and production URL values.
3. Generate the Prisma client with `npx prisma generate`.
4. Apply the industrial catalog seed when ready with `npx prisma db seed`. This creates the industrial categories and archives products under the old categories without deleting product or order records.
5. Start locally with `npm run dev`.

The seed does not invent product records, model specifications, prices or stock. Add verified catalog data through the admin panel. Quote requests are sent to `QUOTE_EMAIL_TO` using the existing Resend configuration (`RESEND_API_KEY` and `ORDER_EMAIL_FROM`).

## Checks

- `npm run lint`
- `npx tsc --noEmit --incremental false`
- `npm run build`

Set `NEXT_PUBLIC_SITE_URL` to the production origin before deployment. Payment environment values and payment handlers are unchanged.
