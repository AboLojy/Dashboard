import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { DashboardService } from '../../services/dashboard.service.js';

describe('Dashboard Service', () => {
  describe('getDashboardData', () => {
    it('should return complete dashboard data for a company', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      
      // Create mock repositories
      const mockCompanyRepo = {
        findById: mock.fn(async () => ({ 
          id: companyId, 
          name: 'Mytestcompany',
          spendLimit: 10000,
          currentSpend: 5400,
          currency: 'SEK'
        })),
        getRemainingSpend: mock.fn(async () => ({
          currentSpend: 5400,
          spendLimit: 10000,
          remaining: 4600,
          currency: 'SEK'
        }))
      };

      const mockTransactionRepo = {
        getLatestTransactions: mock.fn(async () => ([{
          id: '1',
          description: 'Test transaction',
          merchant: 'Test Merchant',
          amount: '100.00',
          currency: 'SEK',
          transactionDate: new Date('2024-12-15')
        }])),
        getTransactionsByCompany: mock.fn(),
        count: mock.fn()
      };

      const mockCardRepo = {
        getCardsByCompany: mock.fn(async () => ([{
          id: '660e8400-e29b-41d4-a716-446655440000',
          cardNumber: '**** **** **** 1234',
          status: 'inactive'
        }])),
        activateCard: mock.fn()
      };

      const mockInvoiceRepo = {
        getUpcomingInvoices: mock.fn(async () => ([{
          id: '1',
          invoiceNumber: 'INV-001',
          amount: '1000.00',
          currency: 'SEK',
          dueDate: new Date('2024-12-20'),
          status: 'pending'
        }]))
      };

      // Inject mocks
      const service = new DashboardService(
        mockCompanyRepo,
        mockTransactionRepo,
        mockCardRepo,
        mockInvoiceRepo
      );

      const result = await service.getDashboardData(companyId);

      // Assertions
      assert.strictEqual(result.company.id, companyId);
      assert.strictEqual(result.company.name, 'Mytestcompany');
      assert.strictEqual(result.remainingSpend.remaining, 4600);
      assert.strictEqual(result.remainingSpend.currentSpend, 5400);
      assert.strictEqual(result.remainingSpend.spendLimit, 10000);
      assert.strictEqual(result.remainingSpend.currency, 'SEK');
      assert.strictEqual(result.card.id, '660e8400-e29b-41d4-a716-446655440000');
      assert.strictEqual(result.latestTransactions.length, 1);
      assert.strictEqual(result.latestTransactions[0].id, '1');
      assert.strictEqual(result.latestTransactions[0].amount, 100);
      assert.strictEqual(result.invoices.length, 1);
      assert.strictEqual(result.invoices[0].invoiceNumber, 'INV-001');

      // Verify mocks were called
      assert.strictEqual(mockCompanyRepo.findById.mock.callCount(), 1);
      assert.strictEqual(mockCompanyRepo.getRemainingSpend.mock.callCount(), 1);
      assert.strictEqual(mockTransactionRepo.getLatestTransactions.mock.callCount(), 1);
      assert.strictEqual(mockCardRepo.getCardsByCompany.mock.callCount(), 1);
      assert.strictEqual(mockInvoiceRepo.getUpcomingInvoices.mock.callCount(), 1);
    });

    it('should handle company not found', async () => {
      const companyId = 'non-existent-id';
      
      const mockCompanyRepo = {
        findById: mock.fn(async () => null),
        getRemainingSpend: mock.fn(async () => {
          throw new Error('Company not found');
        })
      };

      const mockTransactionRepo = {
        getLatestTransactions: mock.fn(async () => [])
      };

      const mockCardRepo = {
        getCardsByCompany: mock.fn(async () => [])
      };

      const mockInvoiceRepo = {
        getUpcomingInvoices: mock.fn(async () => [])
      };

      const service = new DashboardService(
        mockCompanyRepo,
        mockTransactionRepo,
        mockCardRepo,
        mockInvoiceRepo
      );

      await assert.rejects(
        async () => {
          await service.getDashboardData(companyId);
        },
        (error) => {
          return error.message === 'Company not found' || error instanceof TypeError;
        }
      );
    });

    it('should return null card when no cards exist', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';
      
      const mockCompanyRepo = {
        findById: mock.fn(async () => ({ 
          id: companyId, 
          name: 'Mytestcompany' 
        })),
        getRemainingSpend: mock.fn(async () => ({
          currentSpend: 0,
          spendLimit: 10000,
          remaining: 10000,
          currency: 'SEK'
        }))
      };

      const mockTransactionRepo = {
        getLatestTransactions: mock.fn(async () => [])
      };

      const mockCardRepo = {
        getCardsByCompany: mock.fn(async () => [])
      };

      const mockInvoiceRepo = {
        getUpcomingInvoices: mock.fn(async () => [])
      };

      const service = new DashboardService(
        mockCompanyRepo,
        mockTransactionRepo,
        mockCardRepo,
        mockInvoiceRepo
      );

      const result = await service.getDashboardData(companyId);

      assert.strictEqual(result.card, null);
    });
  });

  describe('activateCard', () => {
    it('should activate a card successfully', async () => {
      const cardId = '660e8400-e29b-41d4-a716-446655440000';
      
      const mockCardRepo = {
        activateCard: mock.fn(async () => ({
          id: cardId,
          isActive: true,
          status: 'active',
          cardNumber: '**** **** **** 1234'
        }))
      };

      const service = new DashboardService(null, null, mockCardRepo, null);
      const result = await service.activateCard(cardId);

      assert.strictEqual(result.id, cardId);
      assert.strictEqual(result.isActive, true);
      assert.strictEqual(result.status, 'active');
      assert.strictEqual(mockCardRepo.activateCard.mock.callCount(), 1);
    });

    it('should handle card not found', async () => {
      const cardId = 'non-existent-card';
      
      const mockCardRepo = {
        activateCard: mock.fn(async () => {
          throw new Error('Card not found');
        })
      };

      const service = new DashboardService(null, null, mockCardRepo, null);

      await assert.rejects(
        async () => {
          await service.activateCard(cardId);
        },
        {
          message: 'Card not found'
        }
      );
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
          transactionDate: new Date('2024-12-15'),
          status: 'completed'
        },
        {
          id: '2',
          description: 'Transaction 2',
          merchant: 'Merchant 2',
          amount: '200.00',
          currency: 'SEK',
          transactionDate: new Date('2024-12-14'),
          status: 'completed'
        }
      ];

      const mockTransactionRepo = {
        getTransactionsByCompany: mock.fn(async () => mockTransactions),
        count: mock.fn(async () => 20)
      };

      const service = new DashboardService(null, mockTransactionRepo, null, null);
      const result = await service.getTransactionHistory(companyId, 1, 10);

      assert.strictEqual(result.transactions.length, 2);
      assert.strictEqual(result.transactions[0].id, '1');
      assert.strictEqual(result.transactions[0].amount, 100);
      assert.strictEqual(result.transactions[1].amount, 200);
      assert.strictEqual(result.pagination.page, 1);
      assert.strictEqual(result.pagination.limit, 10);
      assert.strictEqual(result.pagination.total, 20);
      assert.strictEqual(result.pagination.totalPages, 2);
    });

    it('should handle empty transaction list', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';

      const mockTransactionRepo = {
        getTransactionsByCompany: mock.fn(async () => []),
        count: mock.fn(async () => 0)
      };

      const service = new DashboardService(null, mockTransactionRepo, null, null);
      const result = await service.getTransactionHistory(companyId, 1, 10);

      assert.strictEqual(result.transactions.length, 0);
      assert.strictEqual(result.pagination.total, 0);
      assert.strictEqual(result.pagination.totalPages, 0);
    });

    it('should calculate correct offset for page 2', async () => {
      const companyId = '550e8400-e29b-41d4-a716-446655440000';

      const mockTransactionRepo = {
        getTransactionsByCompany: mock.fn(async () => []),
        count: mock.fn(async () => 50)
      };

      const service = new DashboardService(null, mockTransactionRepo, null, null);
      await service.getTransactionHistory(companyId, 2, 10);

      // Check that the function was called with the right offset
      const calls = mockTransactionRepo.getTransactionsByCompany.mock.calls;
      assert.strictEqual(calls[0].arguments[0], companyId);
      assert.strictEqual(calls[0].arguments[1], 10); // limit
      assert.strictEqual(calls[0].arguments[2], 10); // offset = (2-1) * 10
    });
  });
});