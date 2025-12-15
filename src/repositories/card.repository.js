import BaseRepository from './base.repository.js';
import db from '../models/index.js';

class CardRepository extends BaseRepository {
  constructor() {
    super(db.Card);
  }

  async getCardsByCompany(companyId) {
    return await this.findAll({
      where: { companyId },
      include: [{ model: db.Company, as: 'company' }],
    });
  }

  async activateCard(cardId) {
    return await this.update(cardId, { isActive: true, status: 'active' });
  }

  async deactivateCard(cardId) {
    return await this.update(cardId, { isActive: false, status: 'inactive' });
  }
}

export default new CardRepository();