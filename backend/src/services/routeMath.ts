import type { ActivityType, RouteType } from '../types/index.js';

const earthRadiusKm = 6371;

export function estimateMinutes(distanceKm: number, activity: ActivityType) {
  const pace = activity === 'running' ? 6 : activity === 'walking' ? 12 : 15;
  return Math.round(distanceKm * pace);
}

export function formatPace(minutes: number, distanceKm: number) {
  const pace = minutes / Math.max(distanceKm, 0.1);
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}:${String(sec).padStart(2, '0')} /km`;
}

export function destinationPoint(lat: number, lng: number, bearingDegrees: number, distanceKm: number) {
  const bearing = (bearingDegrees * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lng1 = (lng * Math.PI) / 180;
  const angularDistance = distanceKm / earthRadiusKm;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

  return { lat: (lat2 * 180) / Math.PI, lng: (lng2 * 180) / Math.PI };
}

export function waypointPlan(lat: number, lng: number, distanceKm: number, routeType: RouteType) {
  const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233)) * 360;

  if (routeType === 'one-way') {
    return [destinationPoint(lat, lng, seed + 35, distanceKm)];
  }

  if (routeType === 'out-and-back') {
    return [destinationPoint(lat, lng, seed + 90, distanceKm / 2), { lat, lng }];
  }

  const leg = distanceKm / 4;
  return [
    destinationPoint(lat, lng, seed, leg),
    destinationPoint(lat, lng, seed + 90, leg * Math.SQRT2),
    destinationPoint(lat, lng, seed + 180, leg),
    { lat, lng }
  ];
}
