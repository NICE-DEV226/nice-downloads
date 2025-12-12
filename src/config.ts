// API configuration
export const API_URL = import.meta.env.VITE_API_URL || '';

// Helper to build API URLs
export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}
