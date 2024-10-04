const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Permite qualquer domínio, ajuste conforme necessário
    .required()
    .messages({
      'string.empty': 'Email é obrigatório.',
      'string.email': 'Formato de email inválido.',
    }),

  password: Joi.string().min(6).required().messages({
    'string.empty': 'Senha é obrigatória.',
    'string.min': 'A senha deve ter pelo menos 6 caracteres.',
  }),

  firstName: Joi.string().max(100).required().messages({
    'string.empty': 'Primeiro nome é obrigatório.',
    'string.max': 'O primeiro nome não pode exceder 100 caracteres.',
  }),

  lastName: Joi.string().max(100).required().messages({
    'string.empty': 'Sobrenome é obrigatório.',
    'string.max': 'O sobrenome não pode exceder 100 caracteres.',
  }),

  dateOfBirth: Joi.date().iso().required().messages({
    'date.base': 'Data de nascimento deve ser uma data válida.',
    'date.format': 'Data de nascimento deve estar no formato ISO.',
    'any.required': 'Data de nascimento é obrigatória.',
  }),

  profilePicture: Joi.string().uri().optional().messages({
    'string.uri': 'URL da foto de perfil inválida.',
  }),
});

module.exports = registerSchema;
