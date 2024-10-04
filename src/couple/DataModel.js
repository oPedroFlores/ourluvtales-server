// models/Couple.js
const { Sequelize, DataTypes } = require('sequelize');
const database = require('../../db');

const Couple = database.define(
  'Couple',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    coupleName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'couple_name',
    },
  },
  {
    tableName: 'couples',
    timestamps: true,
  },
);

module.exports = Couple;
