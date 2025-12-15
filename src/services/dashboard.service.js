import companyRepository from '../repositories/company.repository.js';
import transactionRepository from '../repositories/transaction.repository.js';
import cardRepository from '../repositories/card.repository.js';
import invoiceRepository from '../repositories/invoice.repository.js';

class DashboardService {
  constructor(companyRepo, transactionRepo, cardRepo, invoiceRepo) {
    this.companyRepository = companyRepo;
    this.transactionRepository = transactionRepo;
    this.cardRepository = cardRepo;
    this.invoiceRepository = invoiceRepo;
  }

  async getDashboardData(companyId) {
    const [company, remainingSpend, latestTransactions, cards, upcomingInvoices] = await Promise.all([
      this.companyRepository.findById(companyId),
      this.companyRepository.getRemainingSpend(companyId),
      this.transactionRepository.getLatestTransactions(companyId, 3),
      this.cardRepository.getCardsByCompany(companyId),
      this.invoiceRepository.getUpcomingInvoices(companyId),
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
    return await this.cardRepository.activateCard(cardId);
  }

  async getTransactionHistory(companyId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const transactions = await this.transactionRepository.getTransactionsByCompany(companyId, limit, offset);
    const total = await this.transactionRepository.count({ where: { companyId } });

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

// Create and export instance with injected dependencies
const dashboardService = new DashboardService(
  companyRepository,
  transactionRepository,
  cardRepository,
  invoiceRepository
);

export default dashboardService;
export { DashboardService }; // Export class for testing