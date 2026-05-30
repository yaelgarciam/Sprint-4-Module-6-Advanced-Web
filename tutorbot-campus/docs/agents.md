# AI Agents Guide — Docs

## What this module does

This folder stores the system architecture, API contract placeholders, and collaboration artifacts for TutorBot Campus. It is the canonical written reference for service boundaries and integration expectations.

## Bounded Context

This module owns documentation, not runtime code. It must never become a dump for stale notes, duplicated source files, or undocumented speculative behavior that conflicts with the actual codebase.

## Key concepts for AI to understand

- source of truth: the document that contributors should rely on for architecture and integration intent
- contract documentation: the written description of REST, websocket, and event payloads used across modules

## When working in this folder, AI should

- [ ] Keep architecture and contract docs aligned with the current codebase
- [ ] Update docs when events, ports, persistence ownership, or service boundaries change
- [ ] Favor tables and clear sectioning for cross-team readability
- [ ] Store manual integration assets in api-contracts/ and postman/
- [ ] Cross-check backend README files before documenting new runtime behavior

## RabbitMQ contract for this service

| Direction | Event | Description |
| --- | --- | --- |
| Listens | — | Docs is not a runtime service |
| Emits | — | Docs is not a runtime service |

## What AI should NOT do here

- Do not add new dependencies without noting it in this file
- Do not document behavior that is not reflected in code or explicitly planned
- Do not let docs drift from service ownership boundaries

## Related files to always check before editing

- architecture.md
- api-contracts/README.md
- ../README.md
