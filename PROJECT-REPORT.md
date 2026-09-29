# Project architecture report

## Framework
- Next.js 16.3.0 App Router (React 19.2.8, TypeScript 5).
- Tailwind CSS 4 for styling.

## Frontend
- Server Components and Server Actions/API route handlers under `src/app`.
- Client components for cart, currency, forms, selectors and support chat.
- Shared layout, navigation, footer, product details, JSON-LD SEO components.

## Backend
- Next.js route handlers in `src/app/api` for accounts, products, cart, checkout/orders, payment providers, support, admin, analytics and merchant feed.

## Database
- PostgreSQL.

## ORM
- Prisma 7.9.1 with PostgreSQL adapter; schema at `prisma/schema.prisma`, generated client in `src/generated/prisma`.
- ZIP includes a PostgreSQL production backup dump. It was not restored or altered.
- No application migration history was present beyond Prisma's migration lock file; production DB was not connected.

## Authentication
- Customer and administrator accounts with bcrypt password hashes and signed JWT cookies using `jose`.

## Payment
- PayPal and Razorpay integrations. Payment handlers and checkout logic were left in place.

## Product system
- Prisma `Product`, `Category`, `ProductImage`, `ProductVariant`, `Review`; status, featured flag, stock, price and product images.
- Variant fields support price, stock, SKU, size/configuration, gauge/rating, finish/specification and custom availability.

## Cart
- Customer-backed Prisma cart plus cart provider and `/api/cart` routes; quantity and variant selection flow into orders.

## Checkout
- Customer, billing/shipping, order creation, tax/discount/shipping calculations, payment and confirmation pages.

## Admin
- Admin sign-in, catalog and category management, product images and variants, order/status/shipment management, analytics, store settings, reviews and support.

## SEO
- Next metadata, product/category JSON-LD, dynamic sitemap and robots routes, merchant XML product feed.

## Deployment
- No Vercel/Netlify/Docker deployment manifest was found. Standard Next scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.
- Runtime configuration is read from environment variables, including `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `ORDER_EMAIL_FROM`, PayPal and Razorpay credentials, analytics settings and authentication secrets. Values are intentionally not recorded here.

## Important files
- `src/app/page.tsx` — storefront homepage
- `src/components/layout/StoreHeader.tsx` — responsive navigation
- `src/components/site/SiteFooter.tsx` — site footer
- `src/app/products` — catalog, category and product detail pages
- `src/components/cart/CartProvider.tsx`, `src/app/api/cart/route.ts` — cart
- `src/app/checkout`, `src/app/api/payments` — checkout/payment flows
- `src/app/api/orders/route.ts` — order creation
- `src/app/admin` and `src/app/api/admin` — administration
- `src/lib/customer-auth.ts`, `src/lib/admin-auth.ts` — authentication
- `prisma/schema.prisma`, `prisma/seed.ts` — data model and catalog seed
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/components/seo` — SEO

The ZIP had no `.git` metadata in the workspace, so a Git checkpoint/commit could not be made. The original ZIP remains unchanged.
