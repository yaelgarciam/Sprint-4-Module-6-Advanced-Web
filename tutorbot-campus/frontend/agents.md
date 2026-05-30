# AI Agents Guide — Frontend

## What this module does

This folder hosts the TutorBot Campus web application. It presents tutoring flows, dashboards, notifications, and student-facing interactions by calling the API gateway and subscribing to real-time updates.

## Bounded Context

This module owns UI composition, client-side state, and API integration at the browser edge. It must never duplicate backend domain rules, directly call internal services that should be behind the API gateway, or redefine backend event contracts without documentation.

## Key concepts for AI to understand

- route-level page: a top-level screen composed from hooks, services, and reusable components
- client integration layer: the code in src/services/ that talks to the API gateway and websocket endpoints
- view model: UI-friendly state derived from backend payloads

## When working in this folder, AI should

- [ ] Always go through the API gateway for backend HTTP access
- [ ] Keep transport logic in src/services/ and UI logic in components/ and pages/
- [ ] Reuse hooks for shared stateful behavior instead of duplicating data-fetch logic across pages
- [ ] Keep backend event naming consistent in websocket client code and docs
- [ ] Add tests next to any new hooks or components once the frontend toolchain is added

## RabbitMQ contract for this service

| Direction | Event | Description |
| --- | --- | --- |
| Listens | — | Frontend does not consume RabbitMQ directly |
| Emits | — | Frontend does not publish RabbitMQ events directly |

## What AI should NOT do here

- Do not add new dependencies without noting it in this file
- Do not call internal microservices directly instead of going through the API gateway
- Do not mirror backend validation or scoring logic in the browser

## Related files to always check before editing

- src/services/README.md
- src/hooks/README.md
- ../docs/architecture.md
