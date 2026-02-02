import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './modules/auth/auth.routes';
import tenantRoutes from './modules/tenant/tenant.routes';
import { errorHandler } from './middleware/error.middleware';
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);


/* existing middleware + routes */
app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);

/* 👇 MUST be last */
app.use(errorHandler);


export default app;
