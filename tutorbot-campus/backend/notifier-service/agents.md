# AI Agents Guide — Notifier Service

## What this module does

This service delivers notifications derived from tutoring events. It fans out gap, path, and milestone updates to websocket clients, Redis pub/sub consumers, and email channels when needed.

## Bounded Context

This service owns delivery orchestration and notification state. It must never own learning path calculation, evaluation logic, or Oracle or MongoDB domain persistence.

## Key concepts for AI to understand

- fanout: delivering the same notification event to multiple channels or recipients
- delivery channel: websocket, Redis pub/sub, or email path used for notification transport
- transient notification state: short-lived delivery data kept for operational visibility rather than domain analytics

## When working in this folder, AI should

- [ ] Always respect the RabbitMQ event contract and consume notifications asynchronously
- [ ] Use Redis Pub/Sub for persistence and delivery state — not Oracle or MongoDB
- [ ] Follow the existing package structure: agent/ config/ controller/ service/ model/ repository/
- [ ] Add tests in test/java/com/tutorbot/notifier/ for every new class in agent/ or service/
- [ ] Keep websocket, email, and pub/sub delivery coordination inside service/ and config/

## RabbitMQ contract for this service

| Direction | Event | Description |
| --- | --- | --- |
| Listens | gap.detected | Triggers student-facing gap alerts |
| Listens | path.updated | Triggers learning plan update notifications |
| Listens | milestone.achieved | Triggers milestone celebration or progress alerts |
| Emits | — | This service does not publish domain events |

## What AI should NOT do here

- Do not add new dependencies to pom.xml without noting it in this file
- Do not call Ollama directly from controller layer — only from service layer
- Do not send websocket or email notifications from controller methods
- Do not introduce Oracle or MongoDB persistence patterns in this module

## Related files to always check before editing

- src/main/java/com/tutorbot/notifier/config/NotifierInfrastructureConfig.java
- src/main/java/com/tutorbot/notifier/agent/NotifierAgent.java
- src/main/java/com/tutorbot/notifier/service/NotificationService.java
- ../shared/
