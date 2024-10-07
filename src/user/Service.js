// user/services/UserService.js
const User = require('./DataModel');
const sequelize = require('../../db');
const CoupleController = require('../couple/Controller');
const CoupleMemberController = require('../couple_member/Controller');
require('dotenv').config();

const createUser = async (userData, isInvite = false, req) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, password, ...otherData } = userData;

    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      throw new Error('Email já está em uso.');
    }

    const user = await User.create(
      {
        email,
        password,
        ...otherData,
      },
      { transaction },
    );

    if (!isInvite) {
      const couple = await CoupleController.createCouple(user, transaction);
    } else {
      const coupleId = req.invite.coupleId;
      console.log('CoupleId: ', coupleId);
      const coupleNewMember = await CoupleMemberController.addCoupleMember(
        coupleId,
        user.id,
        transaction,
      );
      console.log('CoupleNewMember: ', coupleNewMember);
      //TODO Atualizar nome do casal
    }

    await transaction.commit();

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    return userWithoutPassword;
  } catch (error) {
    await transaction.rollback();
    console.log('Error: ', error);
    throw error;
  }
};

const authenticateUser = async (email, password) => {
  // Encontra o usuário pelo email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  // Verifica a senha utilizando o método do modelo
  const isMatch = await user.validPassword(password);
  if (!isMatch) {
    throw new Error('Senha inválida.');
  }

  // Gera o token JWT utilizando o método do modelo
  const token = user.generateAuthToken();

  return token;
};

const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }
  return user;
};

const updateUser = async (userId, updateData, sectionUser) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  if (updateData.email) {
    delete updateData.email;
  }

  if (updateData.password) {
    delete updateData.password;
  }

  if (updateData.role && sectionUser.role !== 'admin') {
    delete updateData.role;
  }

  await user.update(updateData);

  const updatedUser = user.toJSON();
  delete updatedUser.password;

  return updatedUser;
};

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  // O hook beforeDestroy impedirá a deleção de admins
  await user.destroy();
};

const checkEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return !!user;
};

module.exports = {
  createUser,
  authenticateUser,
  getUserById,
  updateUser,
  deleteUser,
  checkEmail,
};
