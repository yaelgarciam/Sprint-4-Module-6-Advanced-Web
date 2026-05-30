# Copilot Instructions — Learning Path Service

## Language & Framework

- Java 17, Spring Boot 3.x
- Spring Web
- Spring Data MongoDB
- Spring AMQP
- Eureka Client

## Coding conventions for this service

- Class names: PascalCase. Event handlers prefixed with on, such as onGapDetected()
- DTOs live in shared/ — never redefine them here
- Log every RabbitMQ event received with log.info("[LEARNING-PATH] Event received: {}", eventId)
- Transactions: keep multi-step updates inside service methods and publish path.updated after persistence succeeds
- Favor idempotent path recalculation methods keyed by studentId plus event id

## Preferred patterns

```java
@RabbitListener(queues = "${rabbitmq.queue.gap-detected}")
public void onGapDetected(GapDetectedEvent event) {
    log.info("[LEARNING-PATH] Processing event: {}", event.getId());
    learningPathService.process(event);
}

public LearningPath updatePath(GapDetectedEvent event) {
    return repository.save(new LearningPath());
}
```

## Test conventions

- Use @ExtendWith(MockitoExtension.class)
- Mock RabbitTemplate and all repositories
- Test naming: shouldPublishPathUpdatedWhenGapDetectedArrives

## Dependencies available in this service

- spring-boot-starter-web
- spring-boot-starter-data-mongodb
- spring-boot-starter-amqp
- spring-cloud-starter-netflix-eureka-client
- spring-boot-starter-actuator
- spring-boot-starter-test

## Snippets Copilot should suggest in this folder

- RabbitMQ @RabbitListener with proper logging
- MongoDB @Document persistence patterns
- Idempotent path recalculation helpers

## Things Copilot must avoid suggesting here

- Do not suggest RestTemplate calls to other internal microservices
- Do not suggest @Transactional on controller layer
- Do not suggest hardcoded queue names — use @Value("${rabbitmq.queue.{name}}")
- Do not suggest JPA entities or Oracle-specific repositories here