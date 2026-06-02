import type { Request, Response } from 'express';
import { z } from 'zod';
import { createAccount, login } from '../services/authService.js';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const signupSchema = authSchema.extend({
  name: z.string().min(2).max(80)
});

export async function signup(req: Request, res: Response) {
  const body = signupSchema.parse(req.body);
  const session = await createAccount(body.name, body.email, body.password);
  res.status(201).json(session);
}

export async function loginController(req: Request, res: Response) {
  const body = authSchema.parse(req.body);
  const session = await login(body.email, body.password);
  res.json(session);
}

export function me(req: Request, res: Response) {
  res.json({ user: req.user });
}
