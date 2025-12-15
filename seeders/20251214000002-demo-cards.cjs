'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const companyId = '550e8400-e29b-41d4-a716-446655440000';
    const cardId = '660e8400-e29b-41d4-a716-446655440000';

    await queryInterface.bulkInsert('cards', [
      {
        id: cardId,
        companyId: companyId,
        cardNumber: '**** **** **** 1234',
        cardHolderName: 'John Doe',
        expiryDate: new Date('2027-12-31'),
        cardImage: 'https://example.com/card-image.png',
        isActive: false,
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardNumber: '**** **** **** 5678',
        cardHolderName: 'Jane Smith',
        expiryDate: new Date('2028-06-30'),
        cardImage: 'https://example.com/card-image-2.png',
        isActive: true,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    console.log('✓ Cards seeded successfully');
    console.log('Card ID (inactive):', cardId);
  },

  async down(queryInterface, Sequelize) {
    const companyId = '550e8400-e29b-41d4-a716-446655440000';
    await queryInterface.bulkDelete('cards', { companyId: companyId }, {});
  }
};