# Backend

## Purpose
Contains all Spring Boot services that implement TutorBot Campus platform capabilities.

## Responsibilities
- Provide service discovery and edge routing
- Execute tutoring-agent workflows through specialized services
- Encapsulate persistence, messaging, and AI integrations by bounded context
- Share backend conventions and reusable patterns

## Services
| Folder | Role |
|--------|------|
| eureka-server | Service discovery registry |
| api-gateway | Edge API routing and security |
| session-service | Session lifecycle and state caching |
| evaluator-service | AI-assisted answer evaluation |
| exercise-service | Adaptive exercise recommendation |
| gap-detector-service | Learning gap detection |
| learning-path-service | Personalized path updates |
| notifier-service | Notifications and real-time fanout |
| shared | Shared backend conventions and planned reusable assets |
