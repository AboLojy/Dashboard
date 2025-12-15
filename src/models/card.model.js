import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Card = sequelize.define('Card', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardHolderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cardImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blocked'),
      defaultValue: 'inactive',
    },
  }, {
    tableName: 'cards',
    timestamps: true,
  });

  return Card;
};