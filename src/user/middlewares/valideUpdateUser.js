const updateUserSchema = require('../validation/updateUserValidation');

const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Extrai todas as mensagens de erro
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

module.exports = validateUpdateUser;
