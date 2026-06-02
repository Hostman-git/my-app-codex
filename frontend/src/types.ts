export type ActivityType = 'running' | 'walking' | 'hiking';
export type RouteType = 'circular' | 'one-way' | 'out-and-back';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface RoutePlan {
  id?: number;
  name: string;
  startLocation: string;
  activityType: ActivityType;
  routeType: RouteType;
  distanceKm: number;
  estimatedMinutes: number;
  averagePace: string;
  elevationGainM: number | null;
  geometry: [number, number][];
  start: { lat: number; lng: number };
  finish: { lat: number; lng: number };
  createdAt?: string;
}
