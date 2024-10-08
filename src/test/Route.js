// Rota de registro de usuário
const express = require('express');
const router = express.Router();
const { handleImageUpload } = require('../S3');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const validateImage = (req, res, next) => {
  const file = req.file;

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (file && !allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({
      error: 'Formato de imagem INVÁLIDO! É aceito apenas JPEG, PNG e GIF',
    });
  }

  next();
};

router.post('/', upload.single('image'), validateImage, async (req, res) => {
  const file = req.file;
  console.log('FIle: ', file);
  if (!file) {
    return res.status(400).json({ error: 'Faltando imagem.', success: false });
  }
  const newImage = await handleImageUpload(file, null);
  return res.status(201).json({ newImage, success: true });
});

module.exports = router;
