import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Invalid request.', issues: error.flatten() });
  }

  const message = error instanceof Error ? error.message : 'Unexpected server error.';
  const status = message.includes('OpenRouteService') ? 502 : 500;
  return res.status(status).json({ message });
}
