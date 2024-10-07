// models/Invitation.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../db'); // Ajuste o caminho conforme necessário
const { v4: uuidv4 } = require('uuid'); // Para gerar UUIDs

class Invitation extends Model {}

Invitation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Gera um UUID v4
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
      field: 'couple_id',
    },
    inviterUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'inviter_user_id',
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    status: {
      type: DataTypes.ENUM('active', 'expired'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'Invitation',
    tableName: 'invitations',
    timestamps: true,
    underscored: true,
  },
);

Invitation.associate = (models) => {
  Invitation.belongsTo(models.Couple, {
    foreignKey: 'couple_id',
    as: 'Couple',
  });
  Invitation.belongsTo(models.User, {
    foreignKey: 'inviter_user_id',
    as: 'Inviter',
  });
};

module.exports = Invitation;
