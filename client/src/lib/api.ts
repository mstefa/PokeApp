/**
 * Resolves the backend API base URL for browser requests.
 */
export function getApiBase(): string {
  return import.meta.env.PUBLIC_API_URL || 'http://localhost:3002';
}
