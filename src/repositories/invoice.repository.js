import BaseRepository from './base.repository.js';
import db from '../models/index.js';
import { Op } from 'sequelize';

class InvoiceRepository extends BaseRepository {
  constructor() {
    super(db.Invoice);
  }

  async getInvoicesByCompany(companyId) {
    return await this.findAll({
      where: { companyId },
      order: [['dueDate', 'ASC']],
    });
  }

  async getDueInvoices(companyId) {
    return await this.findAll({
      where: {
        companyId,
        status: 'pending',
        dueDate: {
          [Op.lte]: new Date(),
        },
      },
    });
  }

  async getUpcomingInvoices(companyId) {
    return await this.findAll({
      where: {
        companyId,
        status: 'pending',
        dueDate: {
          [Op.gt]: new Date(),
        },
      },
      order: [['dueDate', 'ASC']],
    });
  }
}

export default new InvoiceRepository();