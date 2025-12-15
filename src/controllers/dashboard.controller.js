import dashboardService from '../services/dashboard.service.js';

class DashboardController {
  constructor(dashboardSvc) {
    this.dashboardService = dashboardSvc;
  }

  async getDashboard(req, res, next) {
    try {
      const { companyId } = req.params;
      const data = await this.dashboardService.getDashboardData(companyId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async activateCard(req, res, next) {
    try {
      const { cardId } = req.params;
      const card = await this.dashboardService.activateCard(cardId);
      res.json({ success: true, data: card, message: 'Card activated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req, res, next) {
    try {
      const { companyId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const data = await this.dashboardService.getTransactionHistory(companyId, parseInt(page), parseInt(limit));
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

// Create and export instance with injected service
const dashboardController = new DashboardController(dashboardService);

export default dashboardController;
export { DashboardController }; // Export class for testing