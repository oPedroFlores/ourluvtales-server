// user/Routes.js
const express = require('express');
const router = express.Router();
const UserController = require('./Controller');
const validateRegister = require('./middlewares/validateRegister');
const { verifyToken } = require('./middlewares/authMiddleware');
const authorizeRoles = require('./middlewares/authorizeRoles'); // Implementaremos este middleware mais tarde
const authorizeSelfOrAdmin = require('./middlewares/authorizeSelfOrAdmin');
const validateUpdateUser = require('./middlewares/valideUpdateUser');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const photoMiddleware = require('../photo/Middlewares/Middleware');

// Rota de registro de usuário
router.post(
  '/',
  validateRegister,
  upload.single('image'),
  photoMiddleware.validateImageIfSended,
  UserController.register,
);

// Rota de login de usuário
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ error: 'Faltando email ou senha.', success: false });
  UserController.login(req, res);
});

// Rota para obter informações de um usuário
router.get(
  '/:id',
  verifyToken,
  authorizeRoles('admin'),
  verifyToken,
  (req, res) => {
    UserController.getUserById(req, res);
  },
);
// Rota para atualizar um usuário (protegida: apenas o próprio usuário ou admin)
router.put(
  '/:id',
  verifyToken,
  authorizeSelfOrAdmin,
  validateUpdateUser,
  upload.single('image'),
  photoMiddleware.validateImageIfSended,
  UserController.updateUser,
);

// Rota para deletar um usuário (protegida e autorizada)
router.delete('/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
  UserController.deleteUser(req, res);
});

// Verificar se esse email já foi cadastrado
router.get('/email/:email', (req, res) => {
  if (!req.params.email) {
    return res.status(400).json({ error: 'Faltando email.', success: false });
  }
  UserController.checkEmail(req, res);
});

module.exports = router;
