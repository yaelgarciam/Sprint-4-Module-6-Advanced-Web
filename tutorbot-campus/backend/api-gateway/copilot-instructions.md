# Copilot Instructions — API Gateway

## Language & Framework

- Java 17, Spring Boot 3.x
- Spring Cloud Gateway
- Spring Security
- OAuth2 Resource Server / JWT support
- Eureka Client

## Coding conventions for this service

- Class names: PascalCase. Route handler helper methods may use names like resolveSessionServiceRoute()
- DTOs live in shared/ when cross-service payloads are needed
- Log security-sensitive route decisions with enough context for debugging, never with raw secrets
- Keep authentication and authorization in config/ and gateway filters, not in controller methods
- If Redis-backed token invalidation is added, keep it isolated to service/ or config/

## Preferred patterns

```java
// Gateway route catalog pattern
public List<String> defaultRoutes() {
    return List.of("lb://session-service", "lb://evaluator-service");
}

// Security configuration pattern
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http.build();
}
```

## Test conventions

- Use @ExtendWith(MockitoExtension.class) for service-level tests
- Mock downstream route registries or Redis token stores when introduced
- Test naming: shouldRejectRequestWhenTokenIsInvalid

## Dependencies available in this service

- spring-cloud-starter-gateway
- spring-cloud-starter-netflix-eureka-client
- spring-boot-starter-security
- spring-boot-starter-oauth2-resource-server
- spring-boot-starter-actuator
- spring-boot-starter-test

## Snippets Copilot should suggest in this folder

- Gateway route predicates and filters
- SecurityFilterChain configuration
- Token validation helpers for future Redis blacklist support

## Things Copilot must avoid suggesting here

- Do not suggest RestTemplate calls to other internal microservices
- Do not suggest @Transactional on controller layer
- Do not suggest hardcoded service URLs when logical lb:// routes already exist
- Do not suggest tutoring business logic in controller/ or service/