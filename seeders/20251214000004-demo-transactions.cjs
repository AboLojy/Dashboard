'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const companyId = '550e8400-e29b-41d4-a716-446655440000';
    const cardId = '660e8400-e29b-41d4-a716-446655440000';

    const transactions = [
      // Recent transactions (December 2024)
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 450.00,
        currency: 'SEK',
        description: 'Office supplies purchase',
        merchant: 'Office Depot',
        category: 'Office',
        transactionDate: new Date('2024-12-13'),
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 1200.00,
        currency: 'SEK',
        description: 'Software subscription renewal',
        merchant: 'Adobe Creative Cloud',
        category: 'Software',
        transactionDate: new Date('2024-12-12'),
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 890.00,
        currency: 'SEK',
        description: 'Client dinner meeting',
        merchant: 'Restaurant Elite',
        category: 'Entertainment',
        transactionDate: new Date('2024-12-10'),
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 2300.00,
        currency: 'SEK',
        description: 'Google Ads campaign',
        merchant: 'Google Ads',
        category: 'Marketing',
        transactionDate: new Date('2024-12-08'),
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 560.00,
        currency: 'SEK',
        description: 'Train tickets Stockholm-Gothenburg',
        merchant: 'SJ Swedish Railways',
        category: 'Travel',
        transactionDate: new Date('2024-12-05'),
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // November transactions
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 150.00,
        currency: 'SEK',
        description: 'Coffee and tea supplies',
        merchant: 'Café Wholesale AB',
        category: 'Office',
        transactionDate: new Date('2024-11-28'),
        status: 'completed',
        createdAt: new Date('2024-11-28'),
        updatedAt: new Date('2024-11-28')
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 3200.00,
        currency: 'SEK',
        description: 'MacBook Pro for new employee',
        merchant: 'Apple Store',
        category: 'Equipment',
        transactionDate: new Date('2024-11-25'),
        status: 'completed',
        createdAt: new Date('2024-11-25'),
        updatedAt: new Date('2024-11-25')
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 750.00,
        currency: 'SEK',
        description: 'Team building lunch',
        merchant: 'Restaurant Downtown',
        category: 'Entertainment',
        transactionDate: new Date('2024-11-22'),
        status: 'completed',
        createdAt: new Date('2024-11-22'),
        updatedAt: new Date('2024-11-22')
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 1850.00,
        currency: 'SEK',
        description: 'AWS cloud hosting services',
        merchant: 'Amazon Web Services',
        category: 'Infrastructure',
        transactionDate: new Date('2024-11-20'),
        status: 'completed',
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date('2024-11-20')
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 420.00,
        currency: 'SEK',
        description: 'Office stationery supplies',
        merchant: 'Staples Sweden',
        category: 'Office',
        transactionDate: new Date('2024-11-15'),
        status: 'completed',
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date('2024-11-15')
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: null,
        amount: 950.00,
        currency: 'SEK',
        description: 'Domain name renewal',
        merchant: 'GoDaddy',
        category: 'Software',
        transactionDate: new Date('2024-11-10'),
        status: 'completed',
        createdAt: new Date('2024-11-10'),
        updatedAt: new Date('2024-11-10')
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 1250.00,
        currency: 'SEK',
        description: 'LinkedIn Premium Business',
        merchant: 'LinkedIn',
        category: 'Marketing',
        transactionDate: new Date('2024-11-08'),
        status: 'completed',
        createdAt: new Date('2024-11-08'),
        updatedAt: new Date('2024-11-08')
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 680.00,
        currency: 'SEK',
        description: 'Uber for business - Client meetings',
        merchant: 'Uber Business',
        category: 'Travel',
        transactionDate: new Date('2024-11-05'),
        status: 'completed',
        createdAt: new Date('2024-11-05'),
        updatedAt: new Date('2024-11-05')
      },
      // October transactions
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 2100.00,
        currency: 'SEK',
        description: 'Conference tickets - Tech Summit',
        merchant: 'EventBrite',
        category: 'Events',
        transactionDate: new Date('2024-10-28'),
        status: 'completed',
        createdAt: new Date('2024-10-28'),
        updatedAt: new Date('2024-10-28')
      },
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 580.00,
        currency: 'SEK',
        description: 'Hotel accommodation - Conference',
        merchant: 'Scandic Hotels',
        category: 'Travel',
        transactionDate: new Date('2024-10-27'),
        status: 'completed',
        createdAt: new Date('2024-10-27'),
        updatedAt: new Date('2024-10-27')
      },
      // Pending transaction
      {
        id: uuidv4(),
        companyId: companyId,
        cardId: cardId,
        amount: 320.00,
        currency: 'SEK',
        description: 'Zoom Pro subscription',
        merchant: 'Zoom Video Communications',
        category: 'Software',
        transactionDate: new Date(),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // More recent data points for better visualization
      ...Array.from({ length: 45 }, (_, i) => ({
        id: uuidv4(),
        companyId: companyId,
        cardId: i % 3 === 0 ? null : cardId,
        amount: Math.floor(Math.random() * 2000) + 100,
        currency: 'SEK',
        description: [
          'Office supplies',
          'Software subscription',
          'Marketing campaign',
          'Travel expenses',
          'Equipment purchase',
          'Client entertainment',
          'Cloud services',
          'Training materials'
        ][i % 8],
        merchant: [
          'Various Suppliers',
          'Tech Vendors',
          'Service Providers',
          'Travel Agencies',
          'Equipment Stores'
        ][i % 5],
        category: [
          'Office',
          'Software',
          'Marketing',
          'Travel',
          'Equipment',
          'Entertainment'
        ][i % 6],
        transactionDate: new Date(Date.now() - (i + 16) * 24 * 60 * 60 * 1000),
        status: 'completed',
        createdAt: new Date(Date.now() - (i + 16) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - (i + 16) * 24 * 60 * 60 * 1000)
      }))
    ];

    await queryInterface.bulkInsert('transactions', transactions, {});
    console.log('✓ Transactions seeded successfully');
    console.log(`  - ${transactions.length} transactions created`);
    console.log(`  - Latest transaction: ${transactions[0].description}`);
  },

  async down(queryInterface, Sequelize) {
    const companyId = '550e8400-e29b-41d4-a716-446655440000';
    await queryInterface.bulkDelete('transactions', { companyId: companyId }, {});
  }
};