const Joi = require('joi');

const photoSchema = Joi.object({
  caption: Joi.string().max(255).optional().messages({
    'string.max': 'A legenda deve ter no maximo 255 caracteres.',
  }),
  location: Joi.string().max(255).optional().messages({
    'string.max': 'A localização deve ter no maximo 255 caracteres.',
  }),
  imageDate: Joi.date().optional().messages({
    'date.base': 'Data da imagem deve ser uma data válida.',
    'date.format': 'Data da imagem deve estar no formato ISO (YYYY-MM-DD).',
  }),
});
module.exports.validatePhotoUpload = (req, res, next) => {
  const { error } = photoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: error.details.map((detail) => detail.message).join(', '),
      success: false,
    });
  }
  next();
};
