import { config } from '../config.js';
import type { ActivityType, RouteType } from '../types/index.js';
import { destinationPoint, estimateMinutes, formatPace, waypointPlan } from './routeMath.js';

interface OrsGeocodeFeature {
  geometry: { coordinates: [number, number] };
  properties: { label?: string };
}

interface OrsDirectionsResponse {
  features: Array<{
    geometry: { coordinates: [number, number][] };
    properties: {
      summary?: { distance?: number; duration?: number; ascent?: number };
      segments?: Array<{ ascent?: number }>;
    };
  }>;
}

function profileFor(activityType: ActivityType) {
  return activityType === 'running' ? 'foot-walking' : 'foot-hiking';
}

function parseCoordinates(location: string) {
  const match = location.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}` };
}

export async function geocode(location: string) {
  const parsed = parseCoordinates(location);
  if (parsed) return parsed;

  if (!config.orsApiKey) {
    throw new Error('OpenRouteService API key is required for address search. Coordinates like "40.7128, -74.0060" work locally without a key.');
  }

  const url = new URL('https://api.openrouteservice.org/geocode/search');
  url.searchParams.set('api_key', config.orsApiKey);
  url.searchParams.set('text', location);
  url.searchParams.set('size', '1');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('OpenRouteService geocoding request failed.');
  }
  const data = (await response.json()) as { features: OrsGeocodeFeature[] };
  const first = data.features[0];
  if (!first) {
    throw new Error('No location found for that start point.');
  }

  return {
    lat: first.geometry.coordinates[1],
    lng: first.geometry.coordinates[0],
    label: first.properties.label ?? location
  };
}

function fallbackGeometry(lat: number, lng: number, distanceKm: number, routeType: RouteType) {
  const points = waypointPlan(lat, lng, distanceKm, routeType);
  const geometry: [number, number][] = [[lat, lng], ...points.map((point) => [point.lat, point.lng] as [number, number])];

  if (routeType === 'circular') {
    const softened: [number, number][] = [];
    for (let i = 0; i < geometry.length - 1; i += 1) {
      const start = geometry[i];
      const end = geometry[i + 1];
      softened.push(start);
      softened.push([(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]);
    }
    softened.push(geometry[geometry.length - 1]);
    return softened;
  }

  return geometry;
}

export async function generateRoute(
  startLocation: string,
  distanceKm: number,
  activityType: ActivityType,
  routeType: RouteType
) {
  const start = await geocode(startLocation);
  const planned = waypointPlan(start.lat, start.lng, distanceKm, routeType);
  const coordinates = [[start.lng, start.lat], ...planned.map((point) => [point.lng, point.lat])];
  let geometry = fallbackGeometry(start.lat, start.lng, distanceKm, routeType);
  let resolvedDistance = distanceKm;
  let elevationGainM: number | null = null;

  if (config.orsApiKey) {
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/${profileFor(activityType)}/geojson`, {
      method: 'POST',
      headers: {
        Authorization: config.orsApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coordinates,
        elevation: true,
        instructions: false,
        preference: activityType === 'hiking' ? 'recommended' : 'fastest'
      })
    });

    if (response.ok) {
      const data = (await response.json()) as OrsDirectionsResponse;
      const feature = data.features[0];
      if (feature) {
        geometry = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
        const meters = feature.properties.summary?.distance;
        resolvedDistance = meters ? Number((meters / 1000).toFixed(2)) : distanceKm;
        const ascent = feature.properties.summary?.ascent ?? feature.properties.segments?.reduce((sum, segment) => sum + (segment.ascent ?? 0), 0);
        elevationGainM = typeof ascent === 'number' ? Math.round(ascent) : null;
      }
    }
  }

  const estimatedMinutes = estimateMinutes(resolvedDistance, activityType);
  const finishPoint = geometry[geometry.length - 1] ?? geometry[0];

  return {
    name: `${activityType[0].toUpperCase()}${activityType.slice(1)} ${resolvedDistance.toFixed(1)} km`,
    startLocation: start.label,
    activityType,
    routeType,
    distanceKm: resolvedDistance,
    estimatedMinutes,
    averagePace: formatPace(estimatedMinutes, resolvedDistance),
    elevationGainM,
    geometry,
    start: { lat: geometry[0][0], lng: geometry[0][1] },
    finish: { lat: finishPoint[0], lng: finishPoint[1] }
  };
}
