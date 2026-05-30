# Copilot Instructions — Eureka Server

## Language & Framework

- Java 17, Spring Boot 3.x
- Spring Cloud Netflix Eureka Server
- Spring Boot Actuator

## Coding conventions for this service

- Keep the codebase minimal and operationally focused
- Use PascalCase for any new configuration or support classes
- Favor configuration-driven behavior over custom registry logic
- Avoid introducing domain DTOs or persistence models here
- Do not add RabbitMQ, Ollama, or transactional patterns in this service

## Preferred patterns

```java
@Configuration
public class DiscoveryConfiguration {
}

@RestController
class HealthController {
}
```

## Test conventions

- Use @SpringBootTest for basic discovery bootstrap verification
- Prefer lightweight configuration tests over business logic tests
- Test naming: shouldStartDiscoveryServerWhenConfigurationIsValid

## Dependencies available in this service

- spring-cloud-starter-netflix-eureka-server
- spring-boot-starter-actuator
- spring-boot-starter-test

## Snippets Copilot should suggest in this folder

- Eureka configuration classes
- Actuator exposure settings
- Bootstrap smoke tests

## Things Copilot must avoid suggesting here

- Do not suggest RestTemplate calls to internal microservices
- Do not suggest @Transactional on any class in this module
- Do not suggest repositories, entities, or Rabbit listeners here