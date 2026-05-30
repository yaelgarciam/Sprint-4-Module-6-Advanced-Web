# AI Agents Guide — Session Service

## What this module does

This service manages tutoring session state for active user interactions. It is the session lifecycle boundary for starting, updating, and expiring short-lived tutoring context in Redis.

## Bounded Context

This service owns session lifecycle and transient student interaction state. It must never own evaluation scoring, adaptive recommendation logic, long-term learning path data, or Oracle-backed academic records.

## Key concepts for AI to understand

- session context: the Redis-backed state for an active tutoring interaction
- session lifecycle: the start, refresh, and expiration flow for a tutoring session
- ephemeral state: data that is short-lived and optimized for fast access rather than durable analytics

## When working in this folder, AI should

- [ ] Always respect the RabbitMQ event contract and keep session lifecycle events asynchronous
- [ ] Use Redis for persistence — not Oracle or MongoDB
- [ ] Follow the existing package structure: agent/ config/ controller/ service/ model/ repository/
- [ ] Add tests in test/java/com/tutorbot/session/ for every new class in agent/ or service/
- [ ] Keep session expiration and start logic inside service/ and agent/, not inside controllers

## RabbitMQ contract for this service

| Direction | Event | Description |
| --- | --- | --- |
| Listens | — | Session service does not consume domain events in the current contract |
| Emits | session.started | Signals that a new tutoring session became active |
| Emits | session.expired | Signals that a tutoring session was closed or timed out |

## What AI should NOT do here

- Do not add new dependencies to pom.xml without noting it in this file
- Do not call Ollama directly from controller layer — only from service layer
- Do not store evaluation scores, exercise recommendations, or learning path documents here
- Do not replace Redis session storage with relational persistence patterns

## Related files to always check before editing

- src/main/java/com/tutorbot/session/config/SessionRedisConfig.java
- src/main/java/com/tutorbot/session/agent/SessionAgent.java
- src/main/java/com/tutorbot/session/service/SessionService.java
- ../shared/

