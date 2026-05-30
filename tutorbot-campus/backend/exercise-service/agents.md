# AI Agents Guide — Exercise Service

## What this module does

This service generates and manages adaptive exercise recommendations after evaluations are completed. It combines MongoDB-backed recommendation storage with Solr-friendly retrieval concerns.

## Bounded Context

This service owns exercise recommendation generation, recommendation persistence, and search indexing metadata. It must never own Oracle evaluation records, gap detection analytics, or session lifecycle management.

## Key concepts for AI to understand

- recommendation: a suggested next exercise tailored to a learner outcome
- adaptive practice: the strategy of adjusting content difficulty based on prior evaluation results
- Solr index document: the searchable representation of exercise metadata used for retrieval

## When working in this folder, AI should

- [ ] Always respect the RabbitMQ event contract and consume evaluation.completed asynchronously
- [ ] Use MongoDB and Solr for persistence and search — not Oracle
- [ ] Follow the existing package structure: agent/ config/ controller/ service/ model/ repository/
- [ ] Add tests in test/java/com/tutorbot/exercise/ for every new class in agent/ or service/
- [ ] Keep recommendation generation, Solr indexing, and Ollama interactions in service/

## RabbitMQ contract for this service

| Direction | Event | Description |
| --- | --- | --- |
| Listens | evaluation.completed | Receives scored answer outcomes to generate follow-up exercises |
| Emits | — | This service does not publish a domain event yet |

## What AI should NOT do here

- Do not add new dependencies to pom.xml without noting it in this file
- Do not call Ollama directly from controller layer — only from service layer
- Do not create JPA entities or Oracle repositories here
- Do not put Solr indexing logic inside controllers or repository interfaces

## Related files to always check before editing

- src/main/java/com/tutorbot/exercise/config/ExerciseInfrastructureConfig.java
- src/main/java/com/tutorbot/exercise/agent/ExerciseAgent.java
- src/main/java/com/tutorbot/exercise/service/ExerciseService.java
- ../shared/

