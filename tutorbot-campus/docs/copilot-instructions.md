# Copilot Instructions — Docs

## Language & Framework

- Markdown
- Architecture tables and narrative documentation
- API contract placeholders and Postman references

## Coding conventions for this service

- Prefer concise, explicit headings and tables
- Keep event names and ports exactly aligned with the codebase
- Write documentation from the perspective of service ownership and integration boundaries
- Use docs to clarify planned behavior versus current implementation where needed
- Update related README files when architecture text changes materially

## Preferred patterns

```md
## Service Catalog

| Service | Port | Responsibility |
|---------|------|----------------|
| evaluator-service | 8082 | Evaluates student answers |
```

## Test conventions

- Validate links and references manually when adding new docs
- Prefer update names like shouldDescribeGapDetectedFlowWhenArchitectureChanges for future doc checks

## Dependencies available in this service

- Markdown files in docs/
- Architecture tables and placeholder contract documentation

## Snippets Copilot should suggest in this folder

- Service catalog tables
- Event flow tables
- API contract skeleton sections

## Things Copilot must avoid suggesting here

- Do not suggest implementation details that are not present or planned
- Do not suggest duplicating large code samples in docs when a concise explanation will do
- Do not suggest changing event names in docs without corresponding code changes