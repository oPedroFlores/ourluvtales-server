// models/TripPhoto.js
const { Sequelize, DataTypes } = require('sequelize');
const database = require('../../db');

const TripPhoto = database.define(
  'TripPhoto',
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
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'uploaded_by',
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'photo_url',
    },
    caption: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dateTaken: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_taken',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'trip_photos',
    timestamps: true,
    createdAt: 'uploaded_at',
    updatedAt: false,
  },
);

module.exports = TripPhoto;
