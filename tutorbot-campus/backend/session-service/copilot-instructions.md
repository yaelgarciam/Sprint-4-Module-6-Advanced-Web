# Copilot Instructions — Session Service

## Language & Framework

- Java 17, Spring Boot 3.x
- Spring Web
- Spring Data Redis
- Spring Session Data Redis
- Eureka Client

## Coding conventions for this service

- Class names: PascalCase. Event handlers prefixed with on, such as onSessionExpired()
- DTOs live in shared/ when they become cross-service contracts
- Log every RabbitMQ event received with log.info("[SESSION] Event received: {}", eventId)
- Keep session lifecycle mutations in service/ and publish lifecycle events after persistence work completes
- Treat Redis models as fast-moving state, not as a place for long-lived tutoring analytics

## Preferred patterns

```java
@RabbitListener(queues = "${rabbitmq.queue.session-started}")
public void onSessionStarted(SessionEvent event) {
    log.info("[SESSION] Processing event: {}", event.getId());
    sessionService.process(event);
}

@Transactional
public SessionContext expireSession(String sessionId) {
    return sessionRepository.findById(sessionId).orElseThrow();
}
```

## Test conventions

- Use @ExtendWith(MockitoExtension.class)
- Mock RabbitTemplate and all repositories
- Test naming: shouldExpireSessionWhenTtlElapsed

## Dependencies available in this service

- spring-boot-starter-web
- spring-boot-starter-data-redis
- spring-session-data-redis
- spring-cloud-starter-netflix-eureka-client
- spring-boot-starter-actuator
- spring-boot-starter-test

## Snippets Copilot should suggest in this folder

- Redis-backed repository usage
- RabbitMQ event publishing after session state changes
- Session TTL or expiration-oriented service methods

## Things Copilot must avoid suggesting here

- Do not suggest RestTemplate calls to other internal microservices
- Do not suggest @Transactional on controller layer
- Do not suggest hardcoded queue names — use @Value("${rabbitmq.queue.{name}}")
- Do not suggest JPA entities or MongoDB documents in this service