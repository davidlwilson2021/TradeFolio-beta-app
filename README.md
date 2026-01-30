# TradeFolio

> The Blue-Collar Portfolio Platform

## Mission

Create the first system of record and professional identity for skilled tradespeople — enabling them to own their verified digital portfolio, not their employer or a gig platform.

## Vision

Become the "LinkedIn of the Physical World" — a video-first portfolio and recruitment platform for high-end blue-collar trades.

## The Problem

The global workforce is undergoing a massive generational transition, yet the digital infrastructure supporting the skilled trades remains archaic. While the "white-collar" economy has been fully digitized by platforms like LinkedIn, the "blue-collar" economy lacks a comparable system of record.

For electricians, welders, HVAC technicians, and carpenters, career capital is currently trapped in fragmented, ephemeral formats:
- Word-of-mouth reputation
- Paper certifications
- Disorganized photo galleries on personal smartphones

## The Solution

TradeFolio is designed not as a gig marketplace, but as a **Professional Identity Platform**. By combining the visual engagement of Instagram with the structured verification of a credentialing authority, TradeFolio enables tradespeople to:

1. **Document** their work with high-fidelity media portfolios
2. **Verify** their skills through credentials and peer endorsements
3. **Monetize** their reputation independent of their current employer

## Documentation

### Business
- [Business Overview](./docs/business/README.md)
- [Business Strategy](./docs/business/business-strategy.md)
- [Product Requirements](./docs/business/product-requirements.md)
- [Go-to-Market Plan](./docs/business/go-to-market.md)
- [Roadmap & Budget](./docs/business/roadmap-budget.md)
- [Proposal Review & Recommendations](./docs/business/proposal-review.md)

### Technical
- [Architecture Overview](./docs/technical/architecture-overview.md)
- [Database Schema](./docs/technical/database-schema.md)
- [GraphQL API](./docs/technical/graphql-api.md)
- [Offline Sync](./docs/technical/offline-sync.md)
- [Security & Compliance](./docs/technical/security-compliance.md)

### Implementation
- [Feature Prompts](./docs/implementation/feature-prompts.md)
- [Code Prompts](./docs/implementation/code-prompts.md)
- [Remediation Guide](./docs/implementation/remediation-guide.md)

### Reference
- [Strategic Business Proposal](./docs/strategic-business-proposal.md)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native (TypeScript) + Expo |
| Local Data | WatermelonDB (SQLite) |
| Backend | Node.js (NestJS) |
| Database | PostgreSQL (AWS RDS) |
| Search | Typesense or Algolia |
| API | GraphQL |
| Video | Mux (MVP) / AWS MediaConvert (scale) |
| CDN | AWS CloudFront |
| Payments | Stripe Connect Express |
| Identity | Stripe Identity |

---

*TradeFolio: Where skilled labor becomes visible proof of mastery.*
