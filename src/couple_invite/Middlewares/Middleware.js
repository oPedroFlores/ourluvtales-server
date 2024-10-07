const Invite = require('../DataModel');

module.exports.doesInviteExists = async (req, res, next) => {
  try {
    const inviteToken = req.params.token;
    const invite = await Invite.findOne({
      where: { token: inviteToken },
    });
    if (!invite) {
      return res.status(404).json({
        error: 'Convite não encontrado.',
        success: false,
      });
    }
    if (invite.expiresAt < new Date() || invite.status !== 'active') {
      return res.status(404).json({
        error: 'Convite expirado.',
        success: false,
      });
    }
    req.invite = invite;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};
