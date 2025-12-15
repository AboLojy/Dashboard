import BaseRepository from './base.repository.js';
import db from '../models/index.js';

class CompanyRepository extends BaseRepository {
  constructor() {
    super(db.Company);
  }

  async getCompanyWithDetails(companyId) {
    return await this.findById(companyId, {
      include: [
        { model: db.Card, as: 'cards' },
        { 
          model: db.Transaction, 
          as: 'transactions',
          limit: 10,
          order: [['transactionDate', 'DESC']],
        },
        { 
          model: db.Invoice, 
          as: 'invoices',
          where: { status: 'pending' },
          required: false,
        },
      ],
    });
  }

  async getRemainingSpend(companyId) {
    const company = await this.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    return {
      currentSpend: parseFloat(company.currentSpend),
      spendLimit: parseFloat(company.spendLimit),
      remaining: parseFloat(company.spendLimit) - parseFloat(company.currentSpend),
      currency: company.currency,
    };
  }
}

export default new CompanyRepository();