# AI Agents Guide — API Gateway

## What this module does

This service is the secure edge of TutorBot Campus. It authenticates client traffic, resolves downstream routes through Eureka, and exposes the stable entry point for the frontend and external consumers.

## Bounded Context

This service owns routing, authentication, and edge policies. It must never own tutoring business logic, evaluation rules, or direct persistence of academic data beyond gateway-specific concerns such as a future JWT blacklist in Redis.

## Key concepts for AI to understand

- edge routing: forwarding external requests to internal services through a single entry point
- JWT blacklist: a Redis-backed store for invalidated tokens if token revocation is added
- downstream service name: a logical route target resolved through Eureka, such as lb://session-service

## When working in this folder, AI should

- [ ] Always respect the RabbitMQ event contract by keeping gateway logic at the HTTP edge only
- [ ] Use Redis for gateway-local token invalidation concerns, not Oracle or MongoDB
- [ ] Follow the existing package structure: config/ controller/ service/
- [ ] Add tests in test/java/com/tutorbot/apigateway/ for every new class in controller/ or service/
- [ ] Keep route definitions and security rules centralized instead of scattering them across controllers

## RabbitMQ contract for this service

| Direction | Event | Description                                 |
| --------- | ----- | ------------------------------------------- |
| Listens   | —     | The gateway does not consume domain events  |
| Emits     | —     | The gateway does not publish domain events  |

## What AI should NOT do here

- Do not add new dependencies to pom.xml without noting it in this file
- Do not call Ollama directly from controller layer or any layer in this service
- Do not move tutoring workflow logic into the gateway
- Do not bypass Spring Security by adding open routes without explicit justification

## Related files to always check before editing

- src/main/java/com/tutorbot/apigateway/config/SecurityConfig.java
- src/main/java/com/tutorbot/apigateway/controller/GatewayController.java
- src/main/java/com/tutorbot/apigateway/service/RouteCatalogService.java
- ../shared/
