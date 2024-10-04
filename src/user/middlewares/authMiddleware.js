// user/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../DataModel'); // Ajuste o caminho conforme sua estrutura
require('dotenv').config();

module.exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // O token geralmente é enviado no formato: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Acesso negado. Token não fornecido.', success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Busca os dados completos do usuário no banco de dados
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Exclui a senha do resultado
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Usuário não encontrado.', success: false });
    }

    // Verifica se o usuário está ativo
    if (!user.active) {
      return res
        .status(403)
        .json({ error: 'Acesso negado. Usuário desativado.', success: false });
    }

    req.user = user; // Adiciona os dados completos do usuário à requisição
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(400).json({ error: 'Token inválido.', success: false });
  }
};
