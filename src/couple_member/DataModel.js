// models/CoupleMember.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../db'); // Ajuste o caminho conforme necessário

class CoupleMember extends Model {}

CoupleMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Correção: Use DataTypes.UUIDV4 em vez de Sequelize.UUIDV4
      allowNull: false,
      primaryKey: true,
    },
    coupleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'couples',
        key: 'id',
      },
      field: 'couple_id', // Garante o mapeamento correto
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'user_id', // Garante o mapeamento correto
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: 'joined_at',
    },
  },
  {
    sequelize,
    modelName: 'CoupleMember',
    tableName: 'couple_members',
    timestamps: false,
    underscored: true, // Adicionado para converter camelCase para snake_case
    indexes: [
      {
        unique: true,
        fields: ['couple_id', 'user_id'], // Use snake_case aqui
      },
    ],
  },
);

CoupleMember.associate = (models) => {
  CoupleMember.belongsTo(models.Couple, {
    foreignKey: 'couple_id',
    as: 'Couple',
  });
  CoupleMember.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'User',
  });
};

module.exports = CoupleMember;
