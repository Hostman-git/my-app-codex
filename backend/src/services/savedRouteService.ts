import { db } from '../db/database.js';
import type { GeneratedRoute } from '../types/index.js';

interface RouteRow {
  id: number;
  name: string;
  start_location: string;
  activity_type: string;
  route_type: string;
  distance_km: number;
  estimated_minutes: number;
  average_pace: string;
  elevation_gain_m: number | null;
  geometry: string;
  start_lat: number;
  start_lng: number;
  finish_lat: number;
  finish_lng: number;
  created_at: string;
}

function toRoute(row: RouteRow) {
  return {
    id: row.id,
    name: row.name,
    startLocation: row.start_location,
    activityType: row.activity_type,
    routeType: row.route_type,
    distanceKm: row.distance_km,
    estimatedMinutes: row.estimated_minutes,
    averagePace: row.average_pace,
    elevationGainM: row.elevation_gain_m,
    geometry: JSON.parse(row.geometry) as [number, number][],
    start: { lat: row.start_lat, lng: row.start_lng },
    finish: { lat: row.finish_lat, lng: row.finish_lng },
    createdAt: row.created_at
  };
}

export function listRoutes(userId: number) {
  const rows = db
    .prepare('SELECT * FROM routes WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId) as RouteRow[];
  return rows.map(toRoute);
}

export function recentRoutes(userId: number) {
  const rows = db
    .prepare('SELECT * FROM routes WHERE user_id = ? ORDER BY created_at DESC LIMIT 5')
    .all(userId) as RouteRow[];
  return rows.map(toRoute);
}

export function saveRoute(userId: number, route: GeneratedRoute) {
  const result = db
    .prepare(
      `INSERT INTO routes (
        user_id, name, start_location, activity_type, route_type, distance_km,
        estimated_minutes, average_pace, elevation_gain_m, geometry,
        start_lat, start_lng, finish_lat, finish_lng
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      userId,
      route.name,
      route.startLocation,
      route.activityType,
      route.routeType,
      route.distanceKm,
      route.estimatedMinutes,
      route.averagePace,
      route.elevationGainM,
      JSON.stringify(route.geometry),
      route.start.lat,
      route.start.lng,
      route.finish.lat,
      route.finish.lng
    );

  const row = db.prepare('SELECT * FROM routes WHERE id = ?').get(Number(result.lastInsertRowid)) as RouteRow;
  return toRoute(row);
}

export function deleteRoute(userId: number, routeId: number) {
  const result = db.prepare('DELETE FROM routes WHERE user_id = ? AND id = ?').run(userId, routeId);
  return result.changes > 0;
}

export function dashboardStats(userId: number) {
  const totals = db
    .prepare('SELECT COUNT(*) as savedRoutes, COALESCE(SUM(distance_km), 0) as totalKilometers FROM routes WHERE user_id = ?')
    .get(userId) as { savedRoutes: number; totalKilometers: number };

  return {
    savedRoutes: totals.savedRoutes,
    totalKilometers: Number(totals.totalKilometers.toFixed(2)),
    recentRoutes: recentRoutes(userId)
  };
}
