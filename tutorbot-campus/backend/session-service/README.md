# Session Service

## Purpose
The Session Service manages active tutoring sessions and lightweight state needed while a student is interacting with TutorBot Campus. It acts as the session-oriented entry point for answer submissions before evaluation begins.

## Responsibilities
- Persist and retrieve active tutoring session context
- Manage Redis-backed session state and cache-friendly access patterns
- Accept answer submissions that kick off the evaluation workflow
- Emit the initial student.answered event into the tutoring pipeline

## Tech Stack
| Technology | Usage |
|------------|-------|
| Java 21 | Runtime baseline |
| Spring Boot 3 | Service framework |
| Spring Web | REST endpoints |
| Spring Data Redis | Redis persistence access |
| Spring Session | Session lifecycle handling |
| Eureka Client | Service discovery registration |

## Key Files
| File | Description |
|------|-------------|
| pom.xml | Maven build with Redis and session dependencies |
| Dockerfile | Container build definition |
| src/main/java/com/tutorbot/session/SessionServiceApplication.java | Service bootstrap class |
| src/main/java/com/tutorbot/session/agent/SessionAgent.java | Session workflow agent placeholder |
| src/main/java/com/tutorbot/session/controller/SessionController.java | REST entry point for session interactions |
| src/main/java/com/tutorbot/session/service/SessionService.java | Session business logic |
| src/main/java/com/tutorbot/session/model/SessionContext.java | Redis session aggregate |
| src/main/java/com/tutorbot/session/repository/SessionContextRepository.java | Redis repository interface |

## RabbitMQ Events
- **Listens to:** none
- **Emits:** student.answered

## How to Run
```bash
# Start dependencies first
docker compose -f ../../infrastructure/docker-compose.dev.yml up -d

# Run service
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
