# Learning Path Service

## Purpose
The Learning Path Service updates each student’s remediation plan based on detected knowledge gaps, producing adaptive next-step plans that can be consumed by the frontend and notification channels.

## Responsibilities
- Consume gap.detected events
- Persist personalized learning paths in MongoDB
- Recalculate recommended next topics and milestones
- Emit path.updated events after path recalculation

## Tech Stack
| Technology | Usage |
|------------|-------|
| Java 21 | Runtime baseline |
| Spring Boot 3 | Service framework |
| Spring Web | REST endpoints |
| Spring Data MongoDB | Learning path persistence |
| RabbitMQ | Event consumption and publishing |
| Eureka Client | Service discovery registration |

## Key Files
| File | Description |
|------|-------------|
| pom.xml | Maven build with MongoDB and RabbitMQ dependencies |
| Dockerfile | Container build definition |
| src/main/java/com/tutorbot/learningpath/LearningPathServiceApplication.java | Service bootstrap class |
| src/main/java/com/tutorbot/learningpath/agent/LearningPathAgent.java | Main learning path agent placeholder |
| src/main/java/com/tutorbot/learningpath/config/LearningPathMessagingConfig.java | Messaging configuration starter |
| src/main/java/com/tutorbot/learningpath/controller/LearningPathController.java | REST endpoints for path inspection |
| src/main/java/com/tutorbot/learningpath/service/LearningPathService.java | Path update business logic |
| src/main/java/com/tutorbot/learningpath/model/LearningPath.java | MongoDB path document |
| src/main/java/com/tutorbot/learningpath/repository/LearningPathRepository.java | Mongo repository interface |

## RabbitMQ Events
- **Listens to:** gap.detected
- **Emits:** path.updated

## How to Run
```bash
# Start dependencies first
docker compose -f ../../infrastructure/docker-compose.dev.yml up -d

# Run service
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
