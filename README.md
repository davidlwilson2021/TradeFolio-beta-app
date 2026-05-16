# TradeFolio

Skilled trades portfolio and marketplace app — a professional identity platform for tradespeople to document their work, verify credentials, and build portable reputation.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native + Expo (TypeScript) |
| Backend | NestJS + GraphQL (code-first) |
| Database | PostgreSQL 16 |
| ORM | TypeORM |
| Auth | JWT via @nestjs/passport |
| Monorepo | npm workspaces |

## Getting Started

```bash
# Backend
cd backend
npm install
npm run start:dev

# Mobile
cd mobile
npm install
npx expo start
```

Requires PostgreSQL running locally (`localhost:5432`, database `tradefolio_dev`).

## Project Structure

```
backend/          NestJS API server (GraphQL, TypeORM, JWT auth)
mobile/           React Native + Expo client
docs/             Business, technical, and design documentation
```

## Documentation

- [Architecture Overview](./docs/technical/architecture-overview.md)
- [Database Schema](./docs/technical/database-schema.md)
- [GraphQL API](./docs/technical/graphql-api.md)
- [Design System](./docs/design/design-system.md)
- [Security & Compliance](./docs/technical/security-compliance.md)
- [Business Strategy](./docs/business/business-strategy.md)
- [Product Requirements](./docs/business/product-requirements.md)
