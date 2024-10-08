const CoupleMember = require('./DataModel');

module.exports.createCoupleMember = async (coupleId, userId, transaction) => {
  try {
    const coupleMember = await CoupleMember.create(
      {
        coupleId,
        userId,
      },
      { transaction },
    );
    return coupleMember;
  } catch (error) {
    throw error;
  }
};

module.exports.addCoupleMember = async (coupleId, userId, transaction) => {
  try {
    const coupleMember = await CoupleMember.create(
      {
        coupleId,
        userId,
      },
      { transaction },
    );
    return coupleMember;
  } catch (error) {
    throw error;
  }
};

module.exports.getCoupleIdByUserId = async (userId) => {
  try {
    const coupleMember = await CoupleMember.findOne({
      where: { userId },
    });
    return coupleMember.coupleId;
  } catch (error) {
    throw error;
  }
};
