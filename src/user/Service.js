// user/services/UserService.js
const User = require('./DataModel');
const sequelize = require('../../db');
const CoupleController = require('../couple/Controller');
const CoupleMemberController = require('../couple_member/Controller');
const { handleImageUpload } = require('../S3');
require('dotenv').config();

const createUser = async (userData, isInvite = false, req) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, password, ...otherData } = userData;

    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      throw new Error('Email já está em uso.');
    }

    // Fazer upload da foto caso tenha sido enviada
    if (req.file) {
      const newPhotoS3 = await handleImageUpload(req.file, null);
    }

    const user = await User.create(
      {
        email,
        password,
        profilePicture: newPhotoS3,
        ...otherData,
      },
      { transaction },
    );

    if (!isInvite) {
      const couple = await CoupleController.createCouple(
        user,
        transaction,
        req.body.coupleBirthDate,
      );
    } else {
      const coupleId = req.invite.coupleId;
      console.log('CoupleId: ', coupleId);
      await CoupleMemberController.addCoupleMember(
        coupleId,
        user.id,
        transaction,
      );
      //TODO Atualizar nome do casal
      await CoupleController.addUserNameInCoupleName(
        coupleId,
        user.firstName,
        transaction,
      );
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

const getUserNameById = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Usário não encontrado.');
  }
  return { firstName: user.firstName, lastName: user.lastName };
};

module.exports = {
  createUser,
  authenticateUser,
  getUserById,
  updateUser,
  deleteUser,
  checkEmail,
  getUserNameById,
};
