export type ActivityType = 'running' | 'walking' | 'hiking';
export type RouteType = 'circular' | 'one-way' | 'out-and-back';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export interface GeneratedRoute {
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
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
