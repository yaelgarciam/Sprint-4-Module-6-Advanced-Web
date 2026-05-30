# AI Agents Guide — Learning Path Service

## What this module does

This service updates personalized learning paths when gaps are detected. It converts remediation signals into structured milestone sequences and adaptive plans for each student.

## Bounded Context

This service owns learning path persistence and path recalculation. It must never own Oracle evaluation records, gap scoring rules, or notification delivery behavior.

## Key concepts for AI to understand

- learning path: the ordered remediation or progression plan for a student
- milestone: a concrete next step or checkpoint in the path
- idempotent update: safely processing the same event more than once without corrupting path state

## When working in this folder, AI should

- [ ] Always respect the RabbitMQ event contract and consume gap.detected asynchronously
- [ ] Use MongoDB for persistence — not Oracle or Redis
- [ ] Follow the existing package structure: agent/ config/ controller/ service/ model/ repository/
- [ ] Add tests in test/java/com/tutorbot/learningpath/ for every new class in agent/ or service/
- [ ] Make path recalculation idempotent and centered in service/

## RabbitMQ contract for this service

| Direction | Event | Description |
| --- | --- | --- |
| Listens | gap.detected | Receives newly detected deficits to update a student's plan |
| Emits | path.updated | Publishes the recalculated learning path state |

## What AI should NOT do here

- Do not add new dependencies to pom.xml without noting it in this file
- Do not call Ollama directly from controller layer — only from service layer
- Do not introduce Oracle JPA entities in this service
- Do not send notifications directly from this service when notifier-service owns delivery

## Related files to always check before editing

- src/main/java/com/tutorbot/learningpath/config/LearningPathMessagingConfig.java
- src/main/java/com/tutorbot/learningpath/agent/LearningPathAgent.java
- src/main/java/com/tutorbot/learningpath/service/LearningPathService.java
- ../shared/
