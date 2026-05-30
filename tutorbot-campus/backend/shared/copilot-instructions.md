# Copilot Instructions — Shared Backend Module

## Language & Framework

- Java 17 for shared backend contracts
- Spring Boot ecosystem compatibility for DTOs and event classes when introduced

## Coding conventions for this service

- Keep classes small and contract-focused
- DTOs live in shared/ when multiple services depend on them
- Prefer immutable payloads such as records for event contracts where possible
- Keep serialization concerns explicit and documented
- Every new shared contract should be reflected in docs/api-contracts

## Preferred patterns

```java
public record EvaluationCompletedEvent(String id, String studentId, int score) {
}

public enum EventType {
    EVALUATION_COMPLETED,
    GAP_DETECTED
}
```

## Test conventions

- Use focused serialization or validation tests only when logic exists
- Test naming: shouldSerializeEvaluationCompletedEventWhenFieldsArePresent

## Dependencies available in this service

- None yet as an independent module; keep suggestions compatible with Spring Boot services that will consume these classes

## Snippets Copilot should suggest in this folder

- Java records for DTOs and event envelopes
- Enum-backed event names when appropriate
- Validation annotations only when a contract truly requires them

## Things Copilot must avoid suggesting here

- Do not suggest RestTemplate calls to other internal microservices
- Do not suggest @Transactional on any class in this folder
- Do not suggest repositories, controllers, or service-specific logic in shared/