# Copilot Instructions — Frontend

## Language & Framework

- React with Vite
- Browser fetch or typed API client patterns
- WebSocket integration for notifications

## Coding conventions for this service

- Keep components focused on presentation and composition
- Keep API and websocket access in src/services/
- Keep reusable stateful logic in src/hooks/
- Favor explicit prop names and screen-specific view models
- Use the API gateway as the only backend HTTP entry point

## Preferred patterns

```javascript
export function useNotifications() {
  return { connected: false, notifications: [] };
}

export async function fetchSessions() {
  return fetch('/api/v1/sessions');
}
```

## Test conventions

- Prefer component and hook tests when the frontend toolchain is added
- Test naming: shouldRenderNotificationBadgeWhenUnreadItemsExist

## Dependencies available in this service

- React
- Vite
- WebSocket browser APIs

## Snippets Copilot should suggest in this folder

- API gateway service wrappers
- Reusable hooks for notifications and session state
- Page composition from components plus hooks

## Things Copilot must avoid suggesting here

- Do not suggest direct calls to internal microservice URLs
- Do not suggest backend business logic in React components
- Do not suggest storing secrets or environment credentials in source files