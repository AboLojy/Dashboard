import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';
const COMPANY_ID = '550e8400-e29b-41d4-a716-446655440000';
const CARD_ID = '660e8400-e29b-41d4-a716-446655440000';

async function makeRequest(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  return {
    status: response.status,
    data
  };
}

describe('Dashboard API Integration Tests', () => {
  describe('GET /api/companies/:companyId/dashboard', () => {
    it('should return dashboard data for valid company', async () => {
      const response = await makeRequest('GET', `/api/companies/${COMPANY_ID}/dashboard`);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.success, true);
      assert.ok(response.data.data);
      assert.strictEqual(response.data.data.company.id, COMPANY_ID);
      assert.strictEqual(response.data.data.company.name, 'Mytestcompany');
      assert.ok(response.data.data.remainingSpend);
      assert.ok(Array.isArray(response.data.data.latestTransactions));
    });

    it('should return 500 for non-existent company', async () => {
      const response = await makeRequest('GET', `/api/companies/00000000-0000-0000-0000-000000000000/dashboard`);

      assert.strictEqual(response.status, 500);
      assert.strictEqual(response.data.success, false);
    });
  });

  describe('POST /api/cards/:cardId/activate', () => {
    it('should activate a card', async () => {
      const response = await makeRequest('POST', `/api/cards/${CARD_ID}/activate`);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.success, true);
      assert.strictEqual(response.data.message, 'Card activated successfully');
      assert.ok(response.data.data);
    });

    it('should handle non-existent card', async () => {
      const response = await makeRequest('POST', `/api/cards/00000000-0000-0000-0000-000000000000/activate`);

      assert.strictEqual(response.status, 500);
      assert.strictEqual(response.data.success, false);
    });
  });

  describe('GET /api/companies/:companyId/transactions', () => {
    it('should return paginated transactions', async () => {
      const response = await makeRequest('GET', `/api/companies/${COMPANY_ID}/transactions?page=1&limit=10`);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.success, true);
      assert.ok(Array.isArray(response.data.data.transactions));
      assert.ok(response.data.data.pagination);
      assert.strictEqual(response.data.data.pagination.page, 1);
      assert.strictEqual(response.data.data.pagination.limit, 10);
      assert.ok(response.data.data.pagination.total >= 0);
      assert.ok(response.data.data.pagination.totalPages >= 0);
    });

    it('should use default pagination parameters', async () => {
      const response = await makeRequest('GET', `/api/companies/${COMPANY_ID}/transactions`);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.success, true);
      assert.strictEqual(response.data.data.pagination.page, 1);
      assert.strictEqual(response.data.data.pagination.limit, 10);
    });

    it('should handle page 2', async () => {
      const response = await makeRequest('GET', `/api/companies/${COMPANY_ID}/transactions?page=2&limit=5`);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.success, true);
      assert.strictEqual(response.data.data.pagination.page, 2);
      assert.strictEqual(response.data.data.pagination.limit, 5);
    });

    it('should return transactions with correct structure', async () => {
      const response = await makeRequest('GET', `/api/companies/${COMPANY_ID}/transactions?page=1&limit=1`);

      assert.strictEqual(response.status, 200);
      
      if (response.data.data.transactions.length > 0) {
        const transaction = response.data.data.transactions[0];
        assert.ok(transaction.id);
        assert.ok(transaction.description);
        assert.ok(typeof transaction.amount === 'number');
        assert.ok(transaction.currency);
        assert.ok(transaction.date);
        assert.ok(transaction.status);
      }
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for invalid route', async () => {
      const response = await fetch(`${BASE_URL}/api/invalid-route`);
      
      assert.strictEqual(response.status, 404);
    });

    it('should handle malformed company ID', async () => {
      const response = await makeRequest('GET', `/api/companies/invalid-uuid/dashboard`);

      // Should either return 400 or 500 depending on validation
      assert.ok(response.status >= 400);
      assert.strictEqual(response.data.success, false);
    });
  });
});