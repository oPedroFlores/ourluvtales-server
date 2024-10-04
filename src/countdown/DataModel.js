// models/Countdown.js
const { Sequelize, DataTypes } = require('sequelize');
const database = require('../../db');

const Countdown = database.define(
  'Countdown',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    targetDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'target_date',
    },
  },
  {
    tableName: 'countdowns',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

module.exports = Countdown;
