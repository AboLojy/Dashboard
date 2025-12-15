import express from 'express';
import dashboardRoutes from './dashboard.routes.js';

const router = express.Router();

router.use('/api', dashboardRoutes);

export default router;