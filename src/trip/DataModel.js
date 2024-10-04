// models/Trip.js
const { Sequelize, DataTypes } = require('sequelize');
const database = require('../../db');

const Trip = database.define(
  'Trip',
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
    tripName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'trip_name',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'end_date',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'trips',
    timestamps: true,
    hooks: {
      beforeCreate: (trip) => {
        if (trip.endDate < trip.startDate) {
          throw new Error(
            'A data de término não pode ser anterior à data de início.',
          );
        }
      },
    },
  },
);

module.exports = Trip;
