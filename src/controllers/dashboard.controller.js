import dashboardService from '../services/dashboard.service.js';

class DashboardController {
  async getDashboard(req, res, next) {
    try {
      const { companyId } = req.params;
      const data = await dashboardService.getDashboardData(companyId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async activateCard(req, res, next) {
    try {
      const { cardId } = req.params;
      const card = await dashboardService.activateCard(cardId);
      res.json({ success: true, data: card, message: 'Card activated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req, res, next) {
    try {
      const { companyId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const data = await dashboardService.getTransactionHistory(companyId, parseInt(page), parseInt(limit));
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();