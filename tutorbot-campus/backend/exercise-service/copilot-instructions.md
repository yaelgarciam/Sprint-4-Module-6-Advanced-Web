# Copilot Instructions — Exercise Service

## Language & Framework

- Java 17, Spring Boot 3.x
- Spring Web
- Spring Data MongoDB
- Spring AMQP
- SolrJ
- Eureka Client

## Coding conventions for this service

- Class names: PascalCase. Event handlers prefixed with on, such as onEvaluationCompleted()
- DTOs live in shared/ — never redefine them here
- Log every RabbitMQ event received with log.info("[EXERCISE] Event received: {}", eventId)
- All Ollama calls must have a @CircuitBreaker fallback method defined when Ollama integration is introduced in service/
- Keep Solr indexing and MongoDB persistence coordinated from the service layer

## Preferred patterns

```java
@RabbitListener(queues = "${rabbitmq.queue.evaluation-completed}")
public void onEvaluationCompleted(EvaluationCompletedEvent event) {
    log.info("[EXERCISE] Processing event: {}", event.getId());
    exerciseService.process(event);
}

@CircuitBreaker(name = "ollama", fallbackMethod = "fallbackRecommend")
public ExerciseRecommendation recommend(EvaluationCompletedEvent event) {
    return ollamaClient.recommend(event);
}
```

## Test conventions

- Use @ExtendWith(MockitoExtension.class)
- Mock RabbitTemplate, OllamaClient, SolrClient, and all repositories
- Test naming: shouldStoreRecommendationWhenEvaluationCompletedArrives

## Dependencies available in this service

- spring-boot-starter-web
- spring-boot-starter-data-mongodb
- spring-boot-starter-amqp
- spring-cloud-starter-netflix-eureka-client
- solr-solrj
- spring-boot-starter-actuator
- spring-boot-starter-test

## Snippets Copilot should suggest in this folder

- RabbitMQ @RabbitListener with proper logging
- @CircuitBreaker with fallback if Ollama integration is added
- MongoDB @Document persistence patterns
- Solr indexing calls coordinated from service/

## Things Copilot must avoid suggesting here

- Do not suggest RestTemplate calls to other internal microservices
- Do not suggest @Transactional on controller layer
- Do not suggest hardcoded queue names — use @Value("${rabbitmq.queue.{name}}")
- Do not suggest JPA entities or Oracle-specific query code here