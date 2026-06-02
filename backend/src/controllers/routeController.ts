import type { Request, Response } from 'express';
import { z } from 'zod';
import { generateRoute } from '../services/openRouteService.js';
import { dashboardStats, deleteRoute, listRoutes, saveRoute } from '../services/savedRouteService.js';

const routeSchema = z.object({
  startLocation: z.string().min(2),
  distanceKm: z.coerce.number().min(1).max(50),
  activityType: z.enum(['running', 'walking', 'hiking']),
  routeType: z.enum(['circular', 'one-way', 'out-and-back'])
});

const generatedRouteSchema = z.object({
  name: z.string().min(1),
  startLocation: z.string().min(1),
  activityType: z.enum(['running', 'walking', 'hiking']),
  routeType: z.enum(['circular', 'one-way', 'out-and-back']),
  distanceKm: z.number().positive(),
  estimatedMinutes: z.number().int().positive(),
  averagePace: z.string(),
  elevationGainM: z.number().nullable(),
  geometry: z.array(z.tuple([z.number(), z.number()])).min(2),
  start: z.object({ lat: z.number(), lng: z.number() }),
  finish: z.object({ lat: z.number(), lng: z.number() })
});

export async function generate(req: Request, res: Response) {
  const body = routeSchema.parse(req.body);
  const route = await generateRoute(body.startLocation, body.distanceKm, body.activityType, body.routeType);
  res.json({ route });
}

export function save(req: Request, res: Response) {
  const route = generatedRouteSchema.parse(req.body.route);
  const saved = saveRoute(req.user!.id, route);
  res.status(201).json({ route: saved });
}

export function list(req: Request, res: Response) {
  res.json({ routes: listRoutes(req.user!.id) });
}

export function remove(req: Request, res: Response) {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const deleted = deleteRoute(req.user!.id, id);
  if (!deleted) {
    return res.status(404).json({ message: 'Route not found.' });
  }
  return res.status(204).send();
}

export function dashboard(req: Request, res: Response) {
  res.json(dashboardStats(req.user!.id));
}
