'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const companyId = '550e8400-e29b-41d4-a716-446655440000';

    const invoices = [
      {
        id: uuidv4(),
        companyId: companyId,
        invoiceNumber: 'INV-2024-001',
        amount: 2500.00,
        currency: 'SEK',
        dueDate: new Date('2024-12-20'),
        status: 'pending',
        description: 'Monthly service fee - December 2024',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: companyId,
        invoiceNumber: 'INV-2024-002',
        amount: 1800.00,
        currency: 'SEK',
        dueDate: new Date('2025-01-15'),
        status: 'pending',
        description: 'Consulting services - Q4 2024',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: companyId,
        invoiceNumber: 'INV-2024-003',
        amount: 3200.00,
        currency: 'SEK',
        dueDate: new Date('2025-01-20'),
        status: 'pending',
        description: 'Software licenses renewal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        companyId: companyId,
        invoiceNumber: 'INV-2023-098',
        amount: 1500.00,
        currency: 'SEK',
        dueDate: new Date('2024-11-30'),
        status: 'paid',
        description: 'November services - Paid',
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date('2024-11-28')
      },
      {
        id: uuidv4(),
        companyId: companyId,
        invoiceNumber: 'INV-2023-099',
        amount: 2100.00,
        currency: 'SEK',
        dueDate: new Date('2024-10-15'),
        status: 'overdue',
        description: 'October services - Overdue',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('invoices', invoices, {});
    console.log('✓ Invoices seeded successfully');
    console.log(`  - ${invoices.length} invoices created`);
  },

  async down(queryInterface, Sequelize) {
    const companyId = '550e8400-e29b-41d4-a716-446655440000';
    await queryInterface.bulkDelete('invoices', { companyId: companyId }, {});
  }
};