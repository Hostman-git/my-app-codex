import { Router } from 'express';
import { dashboard, generate, list, remove, save } from '../controllers/routeController.js';
import { requireAuth } from '../middleware/auth.js';

export const routeRouter = Router();

routeRouter.post('/generate', generate);
routeRouter.use(requireAuth);
routeRouter.get('/dashboard', dashboard);
routeRouter.get('/routes', list);
routeRouter.post('/routes', save);
routeRouter.delete('/routes/:id', remove);
