# AI Agents Guide — Eureka Server

## What this module does

This service provides service discovery for TutorBot Campus. Other backend modules register with it so the platform can resolve logical service names instead of hard-coded hostnames.

## Bounded Context

This service owns registry and discovery behavior only. It must never touch tutoring domain data, messaging workflows, session state, or agent-specific business logic.

## Key concepts for AI to understand

- service registry: the catalog of active services and their network locations
- discovery client: a backend module that registers itself and resolves other services through Eureka

## When working in this folder, AI should

- [ ] Keep this service limited to discovery concerns only
- [ ] Avoid adding messaging, persistence, or tutoring business rules here
- [ ] Follow the current package structure that centers on the application bootstrap class
- [ ] Add tests under test/java/com/tutorbot/eurekaserver/ when runtime logic is introduced
- [ ] Prefer configuration and operational visibility changes over feature logic changes

## RabbitMQ contract for this service

| Direction | Event | Description                                             |
| --------- | ----- | ------------------------------------------------------- |
| Listens   | —     | This service does not participate in RabbitMQ workflows |
| Emits     | —     | This service does not publish domain events             |

## What AI should NOT do here

- Do not add new dependencies to pom.xml without noting it in this file
- Do not add controller or service logic for tutoring workflows
- Do not introduce Redis, Oracle, MongoDB, Solr, or Ollama access in this module

## Related files to always check before editing

- src/main/java/com/tutorbot/eurekaserver/EurekaServerApplication.java
- pom.xml
- ../api-gateway/
