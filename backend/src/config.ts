import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'development-only-runmap-secret',
  databasePath: path.resolve(process.cwd(), process.env.DATABASE_PATH ?? './data/runmap.db'),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  orsApiKey: process.env.VITE_ORS_API_KEY ?? process.env.ORS_API_KEY ?? ''
};
