import { describe, it, before, after, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import dashboardService from '../../services/dashboard.service.js';
import companyRepository from '../../repositories/company.repository.js';
import transactionRepository from '../../repositories/transaction.repository.js';
import cardRepository from '../../repositories/card.repository.js';
import invoiceRepository from '../../repositories/invoice.repository.js';

describe('Dashboard Service', () => {
  describe('getDashboardData', () => {
    it('should return complete dashboard data for a company', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      
      // Mock repository responses
      const mockCompany = { 
        id: companyId, 
        name: 'Mytestcompany',
        spendLimit: 10000,
        currentSpend: 5400,
        currency: 'SEK'
      };
      
      const mockRemainingSpend = {
        currentSpend: 5400,
        spendLimit: 10000,
        remaining: 4600,
        currency: 'SEK'
      };
      
      const mockTransactions = [
        {
          id: '1',
          description: 'Test transaction',
          merchant: 'Test Merchant',
          amount: '100.00',
          currency: 'SEK',
          transactionDate: new Date()
        }
      ];
      
      const mockCards = [{
        id: '660e8400-e29b-41d4-a716-446655440000',
        cardNumber: '**** **** **** 1234',
        status: 'inactive'
      }];
      
      const mockInvoices = [{
        id: '1',
        invoiceNumber: 'INV-001',
        amount: '1000.00',
        currency: 'SEK',
        dueDate: new Date(),
        status: 'pending'
      }];

      // Mock repository methods
      mock.method(companyRepository, 'findById', () => Promise.resolve(mockCompany));
      mock.method(companyRepository, 'getRemainingSpend', () => Promise.resolve(mockRemainingSpend));
      mock.method(transactionRepository, 'getLatestTransactions', () => Promise.resolve(mockTransactions));
      mock.method(cardRepository, 'getCardsByCompany', () => Promise.resolve(mockCards));
      mock.method(invoiceRepository, 'getUpcomingInvoices', () => Promise.resolve(mockInvoices));

      const result = await dashboardService.getDashboardData(companyId);

      assert.strictEqual(result.company.id, companyId);
      assert.strictEqual(result.company.name, 'Mytestcompany');
      assert.strictEqual(result.remainingSpend.remaining, 4600);
      assert.strictEqual(result.card.id, '660e8400-e29b-41d4-a716-446655440000');
      assert.strictEqual(result.latestTransactions.length, 1);
      assert.strictEqual(result.invoices.length, 1);
    });

    it('should handle company not found', async () => {
      const companyId = 'non-existent-id';
      
      mock.method(companyRepository, 'findById', () => Promise.resolve(null));

      await assert.rejects(
        async () => {
          await dashboardService.getDashboardData(companyId);
        },
        {
          name: 'TypeError'
        }
      );
    });
  });

  describe('activateCard', () => {
    it('should activate a card successfully', async () => {
      const cardId = '660e8400-e29b-41d4-a716-446655440000';
      const mockCard = {
        id: cardId,
        isActive: true,
        status: 'active'
      };

      mock.method(cardRepository, 'activateCard', () => Promise.resolve(mockCard));

      const result = await dashboardService.activateCard(cardId);

      assert.strictEqual(result.id, cardId);
      assert.strictEqual(result.isActive, true);
      assert.strictEqual(result.status, 'active');
    });
  });

  describe('getTransactionHistory', () => {
    it('should return paginated transactions', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      const mockTransactions = [
        {
          id: '1',
          description: 'Transaction 1',
          merchant: 'Merchant 1',
          amount: '100.00',
          currency: 'SEK',
          transactionDate: new Date(),
          status: 'completed'
        },
        {
          id: '2',
          description: 'Transaction 2',
          merchant: 'Merchant 2',
          amount: '200.00',
          currency: 'SEK',
          transactionDate: new Date(),
          status: 'completed'
        }
      ];

      mock.method(transactionRepository, 'getTransactionsByCompany', () => Promise.resolve(mockTransactions));
      mock.method(transactionRepository, 'count', () => Promise.resolve(20));

      const result = await dashboardService.getTransactionHistory(companyId, 1, 10);

      assert.strictEqual(result.transactions.length, 2);
      assert.strictEqual(result.pagination.page, 1);
      assert.strictEqual(result.pagination.limit, 10);
      assert.strictEqual(result.pagination.total, 20);
      assert.strictEqual(result.pagination.totalPages, 2);
    });

    it('should handle empty transaction list', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';

      mock.method(transactionRepository, 'getTransactionsByCompany', () => Promise.resolve([]));
      mock.method(transactionRepository, 'count', () => Promise.resolve(0));

      const result = await dashboardService.getTransactionHistory(companyId, 1, 10);

      assert.strictEqual(result.transactions.length, 0);
      assert.strictEqual(result.pagination.total, 0);
      assert.strictEqual(result.pagination.totalPages, 0);
    });
  });
});