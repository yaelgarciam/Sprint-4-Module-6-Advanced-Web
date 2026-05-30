# Copilot Instructions — Notifier Service

## Language & Framework

- Java 17, Spring Boot 3.x
- Spring Web
- Spring WebSocket
- Spring Data Redis
- Spring Mail
- Spring AMQP
- Eureka Client

## Coding conventions for this service

- Class names: PascalCase. Event handlers prefixed with on, such as onGapDetected()
- DTOs live in shared/ — never redefine them here
- Log every RabbitMQ event received with log.info("[NOTIFIER] Event received: {}", eventId)
- Keep notification fanout and Redis pub/sub logic in service/
- Email sending must be retriable and never initiated from controller layer

## Preferred patterns

```java
@RabbitListener(queues = "${rabbitmq.queue.gap-detected}")
public void onGapDetected(GapDetectedEvent event) {
    log.info("[NOTIFIER] Processing event: {}", event.getId());
    notificationService.process(event);
}

public void publishWebsocket(NotificationMessage message) {
    messagingTemplate.convertAndSend("/topic/notifications", message);
}
```

## Test conventions

- Use @ExtendWith(MockitoExtension.class)
- Mock RabbitTemplate, mail senders, websocket messaging helpers, and all repositories
- Test naming: shouldFanoutNotificationWhenPathUpdatedArrives

## Dependencies available in this service

- spring-boot-starter-web
- spring-boot-starter-websocket
- spring-boot-starter-data-redis
- spring-boot-starter-mail
- spring-boot-starter-amqp
- spring-cloud-starter-netflix-eureka-client
- spring-boot-starter-actuator
- spring-boot-starter-test

## Snippets Copilot should suggest in this folder

- RabbitMQ @RabbitListener with proper logging
- Redis-backed notification persistence helpers
- WebSocket publishing patterns
- Mail delivery wrappers

## Things Copilot must avoid suggesting here

- Do not suggest RestTemplate calls to other internal microservices
- Do not suggest @Transactional on controller layer
- Do not suggest hardcoded queue names — use @Value("${rabbitmq.queue.{name}}")
- Do not suggest Oracle JPA entities or MongoDB documents in this service