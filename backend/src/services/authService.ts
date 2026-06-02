import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { config } from '../config.js';
import type { AuthUser } from '../types/index.js';

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

function sign(user: AuthUser) {
  return jwt.sign(user, config.jwtSecret, { expiresIn: '7d' });
}

export async function createAccount(name: string, email: string, password: string) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const hash = await bcrypt.hash(password, 12);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name, email.toLowerCase(), hash);
  const user = { id: Number(result.lastInsertRowid), name, email: email.toLowerCase() };
  return { token: sign(user), user };
}

export async function login(email: string, password: string) {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as UserRow | undefined;
  if (!row || !(await bcrypt.compare(password, row.password_hash))) {
    throw new Error('Invalid email or password.');
  }

  const user = { id: row.id, name: row.name, email: row.email };
  return { token: sign(user), user };
}
