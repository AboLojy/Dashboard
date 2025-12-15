import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import dashboardController from '../../controllers/dashboard.controller.js';
import dashboardService from '../../services/dashboard.service.js';

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

      const req = { params: { companyId } };
      const res = {
        json: mock.fn()
      };
      const next = mock.fn();

      mock.method(dashboardService, 'getDashboardData', () => Promise.resolve(mockData));

      await dashboardController.getDashboard(req, res, next);

      assert.strictEqual(res.json.mock.calls.length, 1);
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
        success: true,
        data: mockData
      });
    });

    it('should call next with error on failure', async () => {
      const companyId = 'invalid-id';
      const mockError = new Error('Company not found');

      const req = { params: { companyId } };
      const res = { json: mock.fn() };
      const next = mock.fn();

      mock.method(dashboardService, 'getDashboardData', () => Promise.reject(mockError));

      await dashboardController.getDashboard(req, res, next);

      assert.strictEqual(next.mock.calls.length, 1);
      assert.strictEqual(next.mock.calls[0].arguments[0], mockError);
    });
  });

  describe('activateCard', () => {
    it('should activate card successfully', async () => {
      const cardId = '660e8400-e29b-41d4-a716-446655440000';
      const mockCard = { id: cardId, isActive: true, status: 'active' };

      const req = { params: { cardId } };
      const res = { json: mock.fn() };
      const next = mock.fn();

      mock.method(dashboardService, 'activateCard', () => Promise.resolve(mockCard));

      await dashboardController.activateCard(req, res, next);

      assert.strictEqual(res.json.mock.calls.length, 1);
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
        success: true,
        data: mockCard,
        message: 'Card activated successfully'
      });
    });
  });

  describe('getTransactions', () => {
    it('should return paginated transactions', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      const mockData = {
        transactions: [{ id: '1', description: 'Test' }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };

      const req = { 
        params: { companyId },
        query: { page: '1', limit: '10' }
      };
      const res = { json: mock.fn() };
      const next = mock.fn();

      mock.method(dashboardService, 'getTransactionHistory', () => Promise.resolve(mockData));

      await dashboardController.getTransactions(req, res, next);

      assert.strictEqual(res.json.mock.calls.length, 1);
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
        success: true,
        data: mockData
      });
    });

    it('should use default pagination values', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      const mockData = {
        transactions: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      };

      const req = { 
        params: { companyId },
        query: {}
      };
      const res = { json: mock.fn() };
      const next = mock.fn();

      const serviceMethod = mock.method(dashboardService, 'getTransactionHistory', () => Promise.resolve(mockData));

      await dashboardController.getTransactions(req, res, next);

      assert.strictEqual(serviceMethod.mock.calls[0].arguments[1], 1);
      assert.strictEqual(serviceMethod.mock.calls[0].arguments[2], 10);
    });
  });
});