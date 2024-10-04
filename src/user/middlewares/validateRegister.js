// user/middlewares/validateRegister.js

const registerSchema = require('../validation/registerValidation');

const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false }); // abortEarly: false retorna todos os erros

  if (error) {
    // Extrai todas as mensagens de erro
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorMessages, success: false });
  }

  next();
};

module.exports = validateRegister;
