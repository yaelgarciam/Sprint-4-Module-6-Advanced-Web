# TutorBot Campus

TutorBot Campus is a B2B SaaS university tutoring platform organized as a Java Spring Boot microservices monorepo. The platform combines specialized tutoring agents, a React frontend, and shared infrastructure to evaluate student answers, detect learning gaps, adapt learning paths, and notify users in real time.

## Platform Overview

| Layer | Contents | Purpose |
|-------|----------|---------|
| infrastructure | Docker Compose stacks and Kubernetes placeholders | Local development and deployment support |
| backend | Spring Boot microservices and shared backend assets | Core tutoring workflows and platform services |
| frontend | React + Vite application structure | Student and staff-facing web experience |
| docs | Architecture, API contracts, and collaboration artifacts | Project documentation and integration references |
| .github | CI workflow automation | Continuous integration scaffolding |

## Core Services

| Service | Port | Main Dependencies |
|---------|------|-------------------|
| api-gateway | 8080 | Spring Cloud Gateway, JWT, Spring Security |
| session-service | 8081 | Redis, Spring Session |
| evaluator-service | 8082 | Ollama, Oracle, RabbitMQ, circuit breaker |
| exercise-service | 8083 | Ollama, MongoDB, Solr, RabbitMQ |
| gap-detector-service | 8084 | Oracle, RabbitMQ, JPQL |
| learning-path-service | 8085 | MongoDB, RabbitMQ |
| notifier-service | 8086 | WebSocket, Redis Pub/Sub, Spring Mail |
| eureka-server | 8761 | Eureka |

## RabbitMQ Event Flow

| Event | Producer | Consumers |
|-------|----------|-----------|
| student.answered | API / session boundary | evaluator-service |
| evaluation.completed | evaluator-service | exercise-service, gap-detector-service |
| gap.detected | gap-detector-service | learning-path-service, notifier-service |
| path.updated | learning-path-service | notifier-service |

## Monorepo Workflow

1. Start shared dependencies from infrastructure.
2. Start service discovery and platform edge services.
3. Run tutoring agents in dependency order.
4. Launch the frontend once backend APIs are reachable.
5. Track architecture and API changes in docs.

## Quick Start

```bash
cd infrastructure
docker compose -f docker-compose.dev.yml up -d
```

## Next Documentation

- Read docs/architecture.md for service boundaries and data flows.
- Use docs/api-contracts for REST and event contracts.
- Use docs/postman for integration collection placeholders.
