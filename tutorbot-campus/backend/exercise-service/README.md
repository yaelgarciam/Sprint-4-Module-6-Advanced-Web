# Exercise Service

## Purpose
The Exercise Service recommends follow-up exercises after an answer has been evaluated. It combines adaptive learning context, AI-assisted generation, and search-oriented indexing to deliver next-best practice items.

## Responsibilities
- Consume evaluation.completed events
- Persist adaptive exercise recommendations in MongoDB
- Integrate with Solr for indexing and retrieval use cases
- Use Ollama-backed generation to tailor follow-up practice suggestions

## Tech Stack
| Technology | Usage |
|------------|-------|
| Java 21 | Runtime baseline |
| Spring Boot 3 | Service framework |
| Spring Web | REST endpoints and Ollama client support |
| Spring Data MongoDB | Recommendation persistence |
| RabbitMQ | Event-driven recommendation workflow |
| Apache SolrJ | Search indexing and retrieval integration |
| Eureka Client | Service discovery registration |

## Key Files
| File | Description |
|------|-------------|
| pom.xml | Maven build with MongoDB, RabbitMQ, and Solr dependencies |
| Dockerfile | Container build definition |
| src/main/java/com/tutorbot/exercise/ExerciseServiceApplication.java | Service bootstrap class |
| src/main/java/com/tutorbot/exercise/agent/ExerciseAgent.java | Main recommendation agent placeholder |
| src/main/java/com/tutorbot/exercise/config/ExerciseInfrastructureConfig.java | Messaging and indexing configuration starter |
| src/main/java/com/tutorbot/exercise/controller/ExerciseController.java | REST endpoints for exercise recommendations |
| src/main/java/com/tutorbot/exercise/service/ExerciseService.java | Recommendation business logic |
| src/main/java/com/tutorbot/exercise/model/ExerciseRecommendation.java | MongoDB recommendation document |
| src/main/java/com/tutorbot/exercise/repository/ExerciseRecommendationRepository.java | Mongo repository interface |

## RabbitMQ Events
- **Listens to:** evaluation.completed
- **Emits:** none

## How to Run
```bash
# Start dependencies first
docker compose -f ../../infrastructure/docker-compose.dev.yml up -d

# Run service
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
