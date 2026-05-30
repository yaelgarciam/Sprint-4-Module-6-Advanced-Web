# API Gateway

## Purpose
The API Gateway is the secure edge entry point for TutorBot Campus. It centralizes authentication, request routing, and cross-cutting gateway concerns before traffic reaches the tutoring agent services.

## Responsibilities
- Route frontend and client requests to downstream services
- Enforce JWT-based authentication and Spring Security policies
- Expose consolidated edge endpoints and health-friendly discovery integration
- Prepare the platform for rate limiting, observability, and policy enforcement

## Tech Stack
| Technology | Usage |
|------------|-------|
| Java 21 | Runtime baseline |
| Spring Boot 3 | Application framework |
| Spring Cloud Gateway | API routing and edge orchestration |
| Spring Security | Authentication and authorization |
| JWT resource server support | Token validation |
| Eureka Client | Service discovery integration |

## Key Files
| File | Description |
|------|-------------|
| pom.xml | Maven build with gateway and security dependencies |
| Dockerfile | Container build definition |
| src/main/java/com/tutorbot/apigateway/ApiGatewayApplication.java | Gateway bootstrap class |
| src/main/java/com/tutorbot/apigateway/config/SecurityConfig.java | Security filter chain starter |
| src/main/java/com/tutorbot/apigateway/controller/GatewayController.java | Basic gateway-facing endpoint skeleton |
| src/main/java/com/tutorbot/apigateway/service/RouteCatalogService.java | Placeholder route catalog service |

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
