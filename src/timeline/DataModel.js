// models/TimelineEvent.js
const { Sequelize, DataTypes } = require('sequelize');
const database = require('../../db');

const TimelineEvent = database.define(
  'TimelineEvent',
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    eventDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'event_date',
    },
  },
  {
    tableName: 'timeline_events',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

module.exports = TimelineEvent;
