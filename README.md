# Dodo Payments Customer Portal

<p align="center">
  <img src="./.github/banner.png" alt="Storefront Banner" width="100%" />

  <div align="center">
    <a href="https://docs.dodopayments.com/features/customer-portal">
      <img src="https://img.shields.io/badge/docs-live-brightgreen.png" alt="Live Documentation" />
    </a>
    <a href="https://discord.gg/bYqAp4ayYh">
      <img src="https://img.shields.io/discord/1305511580854779984?label=Join%20Discord&logo=discord" alt="Join Discord" />
    </a>
  </div>
</p>

Modern, type-safe customer billing portal built with Next.js 15, React 19, TypeScript, Tailwind CSS, and shadcn/ui. This portal lets your customers manage subscriptions, view invoices, download license keys, and update billing details.

Documentation: [`Customer Portal – Dodo Payments Docs`](https://docs.dodopayments.com/features/customer-portal)

## Features

- Subscription overview and actions (upgrade, cancel)
- Billing history and invoice download
- License keys management and digital delivery
- Profile update and business details
- Internationalization (via `next-intl`)
- Accessible UI using shadcn/ui and Radix primitives

## Tech Stack

- Next.js App Router (RSC-first)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui + Radix UI
- Redux Toolkit for client state where needed

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Open http://localhost:3000

## Project Structure

Key directories:

- `src/app` – routes, layouts, and pages
- `src/components` – UI components (shadcn/ui + custom)
- `src/lib` – helpers for HTTP, currency, dates
- `src/redux` – store and slices for session-scoped UI state

## Internationalization

- Uses Lingo.dev Compiler to localize JSX at build time.
- Config: see `next.config.ts` (`sourceRoot: "src/app"`, `lingoDir: "lingo"`, `sourceLocale: "en"`, `targetLocales: [...]`).
- Runtime: `LingoProvider` in `src/app/layout.tsx` loads `src/app/lingo/dictionary.js`.
- Locale: set via `lingo-locale` cookie (defaults to `en`). Optional UI toggle available.
- Build notes: ensure `LINGODOTDEV_API_KEY` is set.

## Contributing

We welcome contributions! See [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines.

## Security

Please report vulnerabilities responsibly. See [`SECURITY.md`](SECURITY.md).

## License

Distributed under the GPL-3.0 license. See [`LICENSE`](LICENSE).
