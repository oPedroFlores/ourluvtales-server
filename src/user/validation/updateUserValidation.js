// user/validation/updateUserValidation.js

const Joi = require('joi');

/**
 * Schema de validação para atualização de usuário.
 * Nota: O campo 'email' não está incluído, portanto, qualquer tentativa de incluí-lo resultará em erro.
 */
const updateUserSchema = Joi.object({
  password: Joi.string().min(6).optional().messages({
    'string.min': 'A senha deve ter pelo menos 6 caracteres.',
  }),

  firstName: Joi.string().max(100).optional().messages({
    'string.max': 'O primeiro nome não pode exceder 100 caracteres.',
  }),

  lastName: Joi.string().max(100).optional().messages({
    'string.max': 'O sobrenome não pode exceder 100 caracteres.',
  }),

  dateOfBirth: Joi.string().isoDate().optional().messages({
    'string.isoDate':
      'Data de nascimento deve estar no formato ISO (YYYY-MM-DD).',
  }),

  profilePicture: Joi.string().uri().optional().messages({
    'string.uri': 'URL da foto de perfil inválida.',
  }),

  // Exemplo de outros campos que podem ser atualizados
  active: Joi.boolean().optional().messages({
    'boolean.base': 'O campo ativo deve ser um valor booleano.',
  }),

  role: Joi.string().valid('user', 'admin').optional().messages({
    'any.only': 'O campo role deve ser "user" ou "admin".',
  }),
}).strict(); // Impede a presença de campos não definidos no schema

module.exports = updateUserSchema;
