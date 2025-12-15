import companyRepository from '../repositories/company.repository.js';
import transactionRepository from '../repositories/transaction.repository.js';
import cardRepository from '../repositories/card.repository.js';
import invoiceRepository from '../repositories/invoice.repository.js';

class DashboardService {
  async getDashboardData(companyId) {
    const [company, remainingSpend, latestTransactions, cards, upcomingInvoices] = await Promise.all([
      companyRepository.findById(companyId),
      companyRepository.getRemainingSpend(companyId),
      transactionRepository.getLatestTransactions(companyId, 3),
      cardRepository.getCardsByCompany(companyId),
      invoiceRepository.getUpcomingInvoices(companyId),
    ]);

    return {
      company: {
        id: company.id,
        name: company.name,
      },
      remainingSpend,
      card: cards[0] || null,
      latestTransactions: latestTransactions.map(t => ({
        id: t.id,
        description: t.description || t.merchant,
        amount: parseFloat(t.amount),
        currency: t.currency,
        date: t.transactionDate,
      })),
      invoices: upcomingInvoices.slice(0, 1).map(i => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        amount: parseFloat(i.amount),
        currency: i.currency,
        dueDate: i.dueDate,
        status: i.status,
      })),
    };
  }

  async activateCard(cardId) {
    return await cardRepository.activateCard(cardId);
  }

  async getTransactionHistory(companyId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const transactions = await transactionRepository.getTransactionsByCompany(companyId, limit, offset);
    const total = await transactionRepository.count({ where: { companyId } });

    return {
      transactions: transactions.map(t => ({
        id: t.id,
        description: t.description || t.merchant,
        amount: parseFloat(t.amount),
        currency: t.currency,
        date: t.transactionDate,
        status: t.status,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new DashboardService();