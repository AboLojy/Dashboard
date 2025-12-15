'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Use a fixed UUID for consistent seeding
    const companyId = '550e8400-e29b-41d4-a716-446655440000';
    
    await queryInterface.bulkInsert('companies', [{
      id: companyId,
      name: 'Mytestcompany',
      spendLimit: 10000.00,
      currentSpend: 5400.00,
      currency: 'SEK',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    console.log('✓ Company seeded successfully');
    console.log('Company ID:', companyId);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', { name: 'Mytestcompany' }, {});
  }
};