// models/CoupleMember.js
const { Sequelize, DataTypes } = require('sequelize');
const database = require('../../db');

const CoupleMember = database.define(
  'CoupleMember',
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'user_id',
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
      field: 'joined_at',
    },
  },
  {
    tableName: 'couple_members',
    timestamps: false,
  },
);

module.exports = CoupleMember;
