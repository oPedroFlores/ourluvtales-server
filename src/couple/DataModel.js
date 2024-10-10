// models/Couple.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../db');

class Couple extends Model {}

Couple.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    coupleName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'couple_name',
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_of_birth',
    },
  },
  {
    sequelize,
    modelName: 'Couple',
    tableName: 'couples',
    timestamps: true,
  },
);

// Definindo associações após todos os modelos serem importados
Couple.associate = (models) => {
  Couple.belongsToMany(models.User, {
    through: models.CoupleMember,
    foreignKey: 'coupleId',
    otherKey: 'userId',
    as: 'Members',
  });
};

module.exports = Couple;
