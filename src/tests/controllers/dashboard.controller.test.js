import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { DashboardController } from '../../controllers/dashboard.controller.js';

describe('Dashboard Controller', () => {
  describe('getDashboard', () => {
    it('should return dashboard data successfully', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      const mockData = {
        company: { id: companyId, name: 'Mytestcompany' },
        remainingSpend: { currentSpend: 5400, spendLimit: 10000, remaining: 4600, currency: 'SEK' },
        card: { id: '1', cardNumber: '**** 1234' },
        latestTransactions: [],
        invoices: []
      };

      // Mock service
      const mockService = {
        getDashboardData: mock.fn(() => Promise.resolve(mockData))
      };

      const controller = new DashboardController(mockService);

      const req = { params: { companyId } };
      const res = {
        json: mock.fn()
      };
      const next = mock.fn();

      await controller.getDashboard(req, res, next);

      assert.strictEqual(res.json.mock.calls.length, 1);
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
        success: true,
        data: mockData
      });
      assert.strictEqual(mockService.getDashboardData.mock.calls.length, 1);
      assert.strictEqual(mockService.getDashboardData.mock.calls[0].arguments[0], companyId);
      assert.strictEqual(next.mock.calls.length, 0);
    });

  });

  describe('activateCard', () => {
    it('should activate card successfully', async () => {
      const cardId = '660e8400-e29b-41d4-a716-446655440000';
      const mockCard = { id: cardId, isActive: true, status: 'active' };

      const mockService = {
        activateCard: mock.fn(() => Promise.resolve(mockCard))
      };

      const controller = new DashboardController(mockService);

      const req = { params: { cardId } };
      const res = { json: mock.fn() };
      const next = mock.fn();

      await controller.activateCard(req, res, next);

      assert.strictEqual(res.json.mock.calls.length, 1);
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
        success: true,
        data: mockCard,
        message: 'Card activated successfully'
      });
      assert.strictEqual(mockService.activateCard.mock.calls.length, 1);
      assert.strictEqual(mockService.activateCard.mock.calls[0].arguments[0], cardId);
    });

    it('should handle activation failure', async () => {
      const cardId = 'invalid-card-id';
      const mockError = new Error('Card not found');

      const mockService = {
        activateCard: mock.fn(() => Promise.reject(mockError))
      };

      const controller = new DashboardController(mockService);

      const req = { params: { cardId } };
      const res = { json: mock.fn() };
      const next = mock.fn();

      await controller.activateCard(req, res, next);

      assert.strictEqual(next.mock.calls.length, 1);
      assert.strictEqual(next.mock.calls[0].arguments[0], mockError);
      assert.strictEqual(res.json.mock.calls.length, 0);
    });
  });

  describe('getTransactions', () => {
    it('should return paginated transactions', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      const mockData = {
        transactions: [{ id: '1', description: 'Test' }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };

      const mockService = {
        getTransactionHistory: mock.fn(() => Promise.resolve(mockData))
      };

      const controller = new DashboardController(mockService);

      const req = { 
        params: { companyId },
        query: { page: '1', limit: '10' }
      };
      const res = { json: mock.fn() };
      const next = mock.fn();

      await controller.getTransactions(req, res, next);

      assert.strictEqual(res.json.mock.calls.length, 1);
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
        success: true,
        data: mockData
      });
      assert.strictEqual(mockService.getTransactionHistory.mock.calls.length, 1);
      assert.strictEqual(mockService.getTransactionHistory.mock.calls[0].arguments[0], companyId);
      assert.strictEqual(mockService.getTransactionHistory.mock.calls[0].arguments[1], 1);
      assert.strictEqual(mockService.getTransactionHistory.mock.calls[0].arguments[2], 10);
    });


    it('should handle service errors', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      const mockError = new Error('Database error');

      const mockService = {
        getTransactionHistory: mock.fn(() => Promise.reject(mockError))
      };

      const controller = new DashboardController(mockService);

      const req = { 
        params: { companyId },
        query: { page: '1', limit: '10' }
      };
      const res = { json: mock.fn() };
      const next = mock.fn();

      await controller.getTransactions(req, res, next);

      assert.strictEqual(next.mock.calls.length, 1);
      assert.strictEqual(next.mock.calls[0].arguments[0], mockError);
      assert.strictEqual(res.json.mock.calls.length, 0);
    });
  });

});