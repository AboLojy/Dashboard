import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/companies/:companyId/dashboard', (req, res, next) => dashboardController.getDashboard(req, res, next));
router.post('/cards/:cardId/activate', (req, res, next) => dashboardController.activateCard(req, res, next));
router.get('/companies/:companyId/transactions', (req, res, next) => dashboardController.getTransactions(req, res, next));

export default router;