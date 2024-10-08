module.exports.validateImage = (req, res, next) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      error: 'Nenhuma imagem enviada.',
      success: false,
    });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({
      error: 'Formato de imagem INVÁLIDO! É aceito apenas JPEG, PNG e GIF',
      success: false,
    });
  }

  next();
};
