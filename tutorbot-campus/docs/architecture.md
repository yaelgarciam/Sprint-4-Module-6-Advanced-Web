# TutorBot Campus Architecture

## System Summary

TutorBot Campus is a multi-agent tutoring platform built as a Spring Boot microservices monorepo with a React frontend and shared infrastructure for AI-assisted evaluation, adaptive recommendations, and student notifications.

## Context Diagram

| Actor / System | Interaction |
|----------------|-------------|
| Student | Submits answers, views exercises, receives notifications |
| Tutor / Faculty | Reviews outcomes and intervention needs |
| Frontend | Calls the API gateway and subscribes to real-time updates |
| API Gateway | Routes and secures external requests |
| Agent Services | Evaluate answers, detect gaps, and update learning paths |

## Service Catalog

| Service | Port | Data / Integration | Emits | Listens |
|---------|------|--------------------|-------|---------|
| api-gateway | 8080 | JWT, Eureka | - | - |
| session-service | 8081 | Redis, Spring Session | student.answered | - |
| evaluator-service | 8082 | Ollama, Oracle, RabbitMQ | evaluation.completed | student.answered |
| exercise-service | 8083 | Ollama, MongoDB, Solr, RabbitMQ | - | evaluation.completed |
| gap-detector-service | 8084 | Oracle, RabbitMQ, JPQL | gap.detected | evaluation.completed |
| learning-path-service | 8085 | MongoDB, RabbitMQ | path.updated | gap.detected |
| notifier-service | 8086 | WebSocket, Redis Pub/Sub, Spring Mail | - | gap.detected, path.updated |
| eureka-server | 8761 | Discovery registry | - | - |

## Event Flow

| Step | Event | Producer | Consumers | Notes |
|------|-------|----------|-----------|-------|
| 1 | student.answered | Session boundary / API layer | evaluator-service | Raw answer submission enters the pipeline |
| 2 | evaluation.completed | evaluator-service | exercise-service, gap-detector-service | Evaluation score and rationale fan out |
| 3 | gap.detected | gap-detector-service | learning-path-service, notifier-service | Learning deficit information triggers remediation |
| 4 | path.updated | learning-path-service | notifier-service | Students receive updated learning recommendations |

## Data Stores

| Technology | Primary Owner | Purpose |
|------------|---------------|---------|
| Oracle | evaluator-service, gap-detector-service | Transactional records and gap analytics |
| MongoDB | exercise-service, learning-path-service | Adaptive content and personalized plans |
| Redis | session-service, notifier-service | Session state, cache, and pub/sub |
| Apache Solr | exercise-service | Exercise search and ranking |

## Observability

## Security

## Deployment Topology

## Open Questions
- Define external identity provider and JWT issuer details.
- Define schema ownership strategy across Oracle and MongoDB.
- Decide whether event contracts live in shared code or docs only.
