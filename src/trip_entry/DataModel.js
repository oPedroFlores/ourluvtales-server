// models/TripEntry.js
const { Sequelize, DataTypes } = require('sequelize');
const database = require('../../db');

const TripEntry = database.define(
  'TripEntry',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    tripId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'trips',
        key: 'id',
      },
      field: 'trip_id',
    },
    entryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'entry_date',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'trip_entries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

module.exports = TripEntry;
