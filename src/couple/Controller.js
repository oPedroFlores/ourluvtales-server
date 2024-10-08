const Couple = require('./DataModel');
const CoupleMemberController = require('../couple_member/Controller');
const Sequelize = require('sequelize');
module.exports.createCouple = async (firstUser, transaction) => {
  try {
    const userName = `${firstUser.firstName} & `;
    const newCouple = await Couple.create(
      { coupleName: userName },
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
