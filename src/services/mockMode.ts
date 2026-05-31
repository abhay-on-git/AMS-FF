/**
 * Single source of truth for mock/real API mode.
 *
 * Controlled by the VITE_API_MOCK environment variable in .env.local:
 *   VITE_API_MOCK=true   → all services use in-memory mock data (default)
 *   VITE_API_MOCK=false  → all services use the real API via apiClient
 *
 * Every service function wraps its logic with:
 *   if (IS_MOCK) { return mockResult }
 *   return await apiClient.get(...)
 *
 * No consuming code (hooks, components) ever needs to know which mode
 * is active — the switch is transparent at the service boundary.
 */
export const IS_MOCK = import.meta.env.VITE_API_MOCK === 'true'
