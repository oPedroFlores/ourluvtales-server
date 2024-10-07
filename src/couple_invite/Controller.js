const Invite = require('./DataModel');
const CoupleMember = require('../couple_member/DataModel');
module.exports.getInvites = async (req, res) => {
  try {
    const user = req.user;
    const invites = await Invite.findAll({
      where: { inviter_user_id: user.id },
    });
    res.json({ invites, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

module.exports.createInvite = async (req, res) => {
  try {
    const user = req.user;
    // Pegar se já existe um convite criado
    const invite = await Invite.findOne({
      where: { inviter_user_id: user.id },
    });

    if (invite) {
      invite.destroy();
    }

    // Pegar a qual couple este usuario pertence
    const coupleMember = await CoupleMember.findOne({
      where: { user_id: user.id },
    });

    if (!coupleMember) {
      return res.status(404).json({
        error: 'Erro! Não foi encontrado um couple para este usuário.',
        success: false,
      });
    }
    const coupleId = coupleMember.coupleId;
    const inviteData = {
      inviterUserId: user.id,
      coupleId: coupleId,
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      status: 'active',
      token:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
    };

    const createdInvite = await Invite.create(inviteData);

    res.status(201).json({ invite: createdInvite, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};
