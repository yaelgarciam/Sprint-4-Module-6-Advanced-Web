# Notifier Service

## Purpose
The Notifier Service delivers student-facing and operator-facing notifications when gaps are detected or learning paths change. It is the real-time communication edge for the tutoring workflow.

## Responsibilities
- Consume gap.detected and path.updated events
- Publish live notification payloads over WebSocket channels
- Persist transient notification state in Redis and support pub/sub fanout
- Coordinate email delivery for important academic alerts

## Tech Stack
| Technology | Usage |
|------------|-------|
| Java 21 | Runtime baseline |
| Spring Boot 3 | Service framework |
| Spring Web | REST endpoints |
| Spring WebSocket | Real-time notification delivery |
| Spring Data Redis | Notification cache and pub/sub support |
| Spring Mail | Email notification delivery |
| RabbitMQ | Event consumption |
| Eureka Client | Service discovery registration |

## Key Files
| File | Description |
|------|-------------|
| pom.xml | Maven build with websocket, Redis, mail, and RabbitMQ dependencies |
| Dockerfile | Container build definition |
| src/main/java/com/tutorbot/notifier/NotifierServiceApplication.java | Service bootstrap class |
| src/main/java/com/tutorbot/notifier/agent/NotifierAgent.java | Main notification agent placeholder |
| src/main/java/com/tutorbot/notifier/config/NotifierInfrastructureConfig.java | Messaging and realtime configuration starter |
| src/main/java/com/tutorbot/notifier/controller/NotificationController.java | REST endpoints for notification inspection |
| src/main/java/com/tutorbot/notifier/service/NotificationService.java | Delivery and notification orchestration logic |
| src/main/java/com/tutorbot/notifier/model/NotificationMessage.java | Redis-backed notification model |
| src/main/java/com/tutorbot/notifier/repository/NotificationMessageRepository.java | Repository interface for notification data |

## RabbitMQ Events
- **Listens to:** gap.detected, path.updated
- **Emits:** none

## How to Run
```bash
# Start dependencies first
docker compose -f ../../infrastructure/docker-compose.dev.yml up -d

# Run service
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
