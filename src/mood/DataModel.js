// models/Mood.js
const { Sequelize, DataTypes } = require('sequelize');
const database = require('../../db');

const Mood = database.define(
  'Mood',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
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
    coupleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'couples',
        key: 'id',
      },
      field: 'couple_id',
    },
    moodDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'mood_date',
    },
    mood: {
      type: DataTypes.ENUM('Feliz', 'Triste', 'Neutro', 'Ansioso', 'Outro'),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'moods',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

module.exports = Mood;
