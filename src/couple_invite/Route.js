// Rota de registro de usuário
const express = require('express');
const router = express.Router();
const authMiddleware = require('../user/Middlewares/authMiddleware');
const inviteController = require('./Controller');
const inviteMiddleware = require('./Middlewares/Middleware');
const validateRegister = require('../user/middlewares/validateRegister');
const UserService = require('../user/Service');

router.get('/', authMiddleware.verifyToken, inviteController.getInvites);

router.post('/', authMiddleware.verifyToken, inviteController.createInvite);

router.post(
  '/:token',
  inviteMiddleware.doesInviteExists,
  validateRegister,
  async (req, res) => {
    try {
      const user = await UserService.createUser(req.body, true, req);
      res.status(201).json({ user, success: true });
    } catch (error) {
      res.status(400).json({ error: error.message, success: false });
    }
  },
);

module.exports = router;
