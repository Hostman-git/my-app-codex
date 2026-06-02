import type { ActivityType, RoutePlan, RouteType, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'runmap_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? 'Request failed.');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function signup(payload: { name: string; email: string; password: string }) {
  return request<{ token: string; user: User }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function login(payload: { email: string; password: string }) {
  return request<{ token: string; user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function fetchMe() {
  return request<{ user: User }>('/api/auth/me');
}

export function generateRoute(payload: {
  startLocation: string;
  distanceKm: number;
  activityType: ActivityType;
  routeType: RouteType;
}) {
  return request<{ route: RoutePlan }>('/api/generate', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function saveRoute(route: RoutePlan) {
  return request<{ route: RoutePlan }>('/api/routes', {
    method: 'POST',
    body: JSON.stringify({ route })
  });
}

export function listRoutes() {
  return request<{ routes: RoutePlan[] }>('/api/routes');
}

export function deleteRoute(id: number) {
  return request<void>(`/api/routes/${id}`, { method: 'DELETE' });
}

export function fetchDashboard() {
  return request<{ savedRoutes: number; totalKilometers: number; recentRoutes: RoutePlan[] }>('/api/dashboard');
}
