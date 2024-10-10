// user/DataModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db'); // Atualize o caminho conforme sua estrutura
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class User extends Sequelize.Model {
  /**
   * Compara uma senha fornecida com a senha armazenada (hash).
   * @param {string} password - A senha fornecida pelo usuário.
   * @returns {Promise<boolean>} - Verdadeiro se as senhas coincidirem, falso caso contrário.
   */
  async validPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  /**
   * Gera um token de autenticação JWT para o usuário.
   * @returns {string} - Token JWT.
   */
  generateAuthToken() {
    return jwt.sign(
      { id: this.id, email: this.email, role: this.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email inválido',
        },
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_of_birth',
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_picture',
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // Impedir que admins sejam apagados
      beforeDestroy: async (user) => {
        if (user.role === 'admin') {
          throw new Error('Admins cannot be deleted');
        }
      },
    },
  },
);

User.associate = (models) => {
  User.belongsToMany(models.Couple, {
    through: models.CoupleMember,
    foreignKey: 'userId',
    otherKey: 'coupleId',
    as: 'Couples',
  });
};

module.exports = User;
