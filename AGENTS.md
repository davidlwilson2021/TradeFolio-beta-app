# AGENTS.md

Durable memory for TradeFolio. The continual-learning plugin updates this from chat transcripts (high-signal items only).

## Learned User Preferences

- Prefer persistent memory in files (`AGENTS.md`, user rules) over long chat threads.
- Keep context under 25%; hand off to a new chat with a Session handoff block when usage is high.

## Learned Workspace Facts

- Monorepo at `C:\dev\tradefolio` with npm workspaces: `backend` (NestJS + GraphQL code-first), `mobile` (React Native + Expo), `shared`.
- PostgreSQL 16 dev DB: `tradefolio_dev` on `localhost:5432`; TypeORM `synchronize: true` in dev.
- Git remote: `davidlwilson2021/tradefolio-beta-app`.
- Detailed build context: `CLAUDE_TradeFolio.md` and `.claude/plans/` (ask which sprint before large feature work).
