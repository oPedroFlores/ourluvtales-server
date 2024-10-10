const Joi = require('joi');

const coupleSchema = Joi.object({
  coupleName: Joi.string().max(255).min(3).optional().messages({
    'string.max': 'A legenda deve ter entre 3 e 255 caracteres.',
  }),

  coupleBirthDate: Joi.date().iso().messages({
    'date.base': 'Inicio do relacionamento deve ser uma data válida.',
    'date.format': 'Inicio do relacionamento deve estar no formato ISO.',
  }),
});
module.exports.validateCoupleUpdate = (req, res, next) => {
  const { error } = coupleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: error.details.map((detail) => detail.message).join(', '),
      success: false,
    });
  }
  next();
};
