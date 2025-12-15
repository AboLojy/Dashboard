import { Sequelize } from 'sequelize';
import config from '../config/database.js';
import Company from './company.model.js';
import Card from './card.model.js';
import Transaction from './transaction.model.js';
import Invoice from './invoice.model.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: false,
  }
);

const db = {
  sequelize,
  Sequelize,
  Company: Company(sequelize),
  Card: Card(sequelize),
  Transaction: Transaction(sequelize),
  Invoice: Invoice(sequelize),
};

// Define associations
db.Company.hasMany(db.Card, { foreignKey: 'companyId', as: 'cards' });
db.Card.belongsTo(db.Company, { foreignKey: 'companyId', as: 'company' });

db.Company.hasMany(db.Transaction, { foreignKey: 'companyId', as: 'transactions' });
db.Transaction.belongsTo(db.Company, { foreignKey: 'companyId', as: 'company' });

db.Company.hasMany(db.Invoice, { foreignKey: 'companyId', as: 'invoices' });
db.Invoice.belongsTo(db.Company, { foreignKey: 'companyId', as: 'company' });

db.Card.hasMany(db.Transaction, { foreignKey: 'cardId', as: 'transactions' });
db.Transaction.belongsTo(db.Card, { foreignKey: 'cardId', as: 'card' });

export default db;