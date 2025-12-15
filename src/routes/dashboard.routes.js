import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/companies/:companyId/dashboard', dashboardController.getDashboard);
router.post('/cards/:cardId/activate', dashboardController.activateCard);
router.get('/companies/:companyId/transactions', dashboardController.getTransactions);

export default router;