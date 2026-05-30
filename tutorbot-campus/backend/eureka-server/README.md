# Eureka Server

## Purpose
The Eureka Server is the discovery backbone of TutorBot Campus. It allows the API gateway and the tutoring agent services to register themselves and resolve each other dynamically across local, test, and production-like environments.

## Responsibilities
- Maintain the service registry for all backend services
- Allow dynamic service lookup by logical name
- Support fault isolation by reducing hard-coded endpoint dependencies
- Provide a central discovery console for local development

## Tech Stack
| Technology | Usage |
|------------|-------|
| Java 21 | Runtime baseline |
| Spring Boot 3 | Application framework |
| Spring Cloud Netflix Eureka Server | Service discovery registry |
| Spring Boot Actuator | Operational monitoring hooks |

## Key Files
| File | Description |
|------|-------------|
| pom.xml | Maven build with Eureka Server dependencies |
| Dockerfile | Container build definition |
| src/main/java/com/tutorbot/eurekaserver/EurekaServerApplication.java | Main discovery server bootstrap class |

## RabbitMQ Events
- **Listens to:** none
- **Emits:** none

## How to Run
```bash
# Start dependencies first
docker compose -f ../../infrastructure/docker-compose.dev.yml up -d

# Run service
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
