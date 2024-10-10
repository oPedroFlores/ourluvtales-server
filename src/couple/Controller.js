const Couple = require('./DataModel');
const CoupleMemberController = require('../couple_member/Controller');
const Sequelize = require('sequelize');
const User = require('../user/DataModel');
module.exports.createCouple = async (
  firstUser,
  transaction,
  coupleBirthDate,
) => {
  try {
    const userName = `${firstUser.firstName} & `;
    const newCouple = await Couple.create(
      { coupleName: userName, dateOfBirth: coupleBirthDate },
      { transaction },
    );

    const coupleMember = await CoupleMemberController.createCoupleMember(
      newCouple.id,
      firstUser.id,
      transaction,
    );

    return { newCouple, coupleMember, success: true };
  } catch (error) {
    throw error;
  }
};

module.exports.updateCoupleName = async (coupleId, coupleName, transaction) => {
  try {
    const couple = await Couple.update(
      { coupleName },
      { where: { id: coupleId }, transaction },
    );
    return couple;
  } catch (error) {
    throw error;
  }
};

module.exports.addUserNameInCoupleName = async (
  coupleId,
  userName,
  transaction,
) => {
  try {
    const couple = await Couple.update(
      {
        coupleName: Sequelize.fn(
          'CONCAT',
          Sequelize.col('couple_name'),
          userName,
        ),
      },
      { where: { id: coupleId }, transaction },
    );
    return couple;
  } catch (error) {
    throw error;
  }
};

module.exports.getCoupleInfo = async (req, res) => {
  try {
    const user = req.user;

    // Achar coupleId pelo userId
    const coupleId = await CoupleMemberController.getCoupleIdByUserId(user.id);
    if (!coupleId) {
      return res.status(404).json({
        error: 'Erro! Não foi encontrado um couple para este usuário.',
        success: false,
      });
    }

    // Buscar informações do casal incluindo os membros
    const coupleInfo = await Couple.findOne({
      where: { id: coupleId },
      attributes: ['id', 'coupleName', 'dateOfBirth'],
      include: [
        {
          model: User,
          as: 'Members',
          attributes: ['firstName', 'lastName', 'email', 'id'],
          through: {
            attributes: [], //* Escluir os dados da tabela intermediaria, coupleMembers
          },
        },
      ],
    });

    if (!coupleInfo) {
      return res.status(404).json({
        error: 'Casal não encontrado.',
        success: false,
      });
    }

    return res.status(200).json({ coupleInfo, success: true });
  } catch (error) {
    console.error('Erro ao obter informações do casal:', error);
    return res
      .status(500)
      .json({ error: 'Erro interno do servidor.', success: false });
  }
};

module.exports.updateCouple = async (req, res) => {
  try {
    const { coupleName, coupleBirthDate } = req.body;
    if (!coupleName && !coupleBirthDate) {
      return res.status(400).json({
        error: 'Nome ou data de nascimento devem ser informados.',
        success: false,
      });
    }
    const coupleId = await CoupleMemberController.getCoupleIdByUserId(
      req.user.id,
    );
    const couple = await Couple.update(
      { coupleName, dateOfBirth: coupleBirthDate },
      { where: { id: coupleId } },
    );
    return res.status(200).json({ couple, success: true });
  } catch (error) {
    console.error('Erro ao atualizar o casal:', error);
    return res
      .status(500)
      .json({ error: 'Erro interno do servidor.', success: false });
  }
};
