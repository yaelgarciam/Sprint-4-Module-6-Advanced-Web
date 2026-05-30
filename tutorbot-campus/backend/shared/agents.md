# AI Agents Guide — Shared Backend Module

## What this module does

This folder is reserved for shared backend contracts, DTOs, and event definitions that are intentionally reused across services. It is the place to centralize stable cross-service artifacts when duplication becomes risky.

## Bounded Context

This module owns shared contracts only. It must never absorb business logic from any service or become a catch-all utility bucket for unrelated helpers.

## Key concepts for AI to understand

- shared DTO: a reusable payload type consumed by more than one service
- canonical event: the normalized event contract all services should agree on

## When working in this folder, AI should

- [ ] Keep shared artifacts small, explicit, and versionable
- [ ] Move only truly cross-service code here
- [ ] Preserve neutral naming that does not privilege one bounded context over another
- [ ] Add tests when serialization or validation logic is introduced
- [ ] Document every new shared contract in docs/api-contracts

## RabbitMQ contract for this service

| Direction | Event | Description |
| --- | --- | --- |
| Listens | — | Shared is not a running service |
| Emits | — | Shared is not a running service |

## What AI should NOT do here

- Do not add new dependencies to pom.xml without noting it in this file
- Do not add service-specific repositories, controllers, or persistence models here
- Do not create generic utility classes with unclear ownership

## Related files to always check before editing

- README.md
- ../../docs/api-contracts/
- ../evaluator-service/
