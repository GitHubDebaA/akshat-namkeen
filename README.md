# Akshat Namkeen

An India-focused storefront for Akshat Namkeen, built with Next.js, PostgreSQL, Prisma, and NextAuth.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and set the database, authentication, Google sign-in, and email values you use.
3. Apply the database migrations with `npm exec prisma -- migrate deploy`.
4. Start the development site with `npm run dev`.

Run `npm run build` to create the production build and `npm start` to serve it.

## Order operations

Checkout currently supports cash on delivery. The server reloads active product prices, saves an order and its item snapshots, and applies the store's ₹40 delivery fee on orders of ₹500 or less; orders above ₹500 ship free. Product prices are treated as tax inclusive. Courier booking is manual.

Set `ADMIN_EMAILS` to a comma-separated list of account emails allowed to use `/admin/orders`. The page lets those accounts advance order status, record COD collection, and enter courier and tracking details. If this setting is absent, the order-management page stays inaccessible.

Only customers with a delivered order can leave one review per product. Reviews are marked as verified purchases.

## Before launch

- Apply the database migrations in the deployment environment.
- Set a production `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, database URL, Google OAuth credentials (if Google sign-in is enabled), email credentials, and `ADMIN_EMAILS`.
- Confirm the return window, customer support contacts, legal business details, and public domain.
- Verify product availability and delivery serviceability for the postal codes you intend to serve.
