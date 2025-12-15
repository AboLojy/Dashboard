import BaseRepository from './base.repository.js';
import db from '../models/index.js';
import { Op } from 'sequelize';

class TransactionRepository extends BaseRepository {
  constructor() {
    super(db.Transaction);
  }

  async getTransactionsByCompany(companyId, limit = 10, offset = 0) {
    return await this.findAll({
      where: { companyId },
      limit,
      offset,
      order: [['transactionDate', 'DESC']],
      include: [{ model: db.Card, as: 'card' }],
    });
  }

  async getLatestTransactions(companyId, limit = 3) {
    return await this.getTransactionsByCompany(companyId, limit, 0);
  }

  async getTransactionStats(companyId, startDate, endDate) {
    return await this.model.findAll({
      where: {
        companyId,
        transactionDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalAmount'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalCount'],
      ],
    });
  }
}

export default new TransactionRepository();