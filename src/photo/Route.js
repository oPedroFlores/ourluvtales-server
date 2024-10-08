const express = require('express');
const router = express.Router();
const authMiddleware = require('../user/middlewares/authMiddleware');
const photoController = require('./Controller');
const photoMiddleware = require('./Middlewares/Middleware');
const { validatePhotoUpload } = require('./Middlewares/PhotoSchema');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  authMiddleware.verifyToken,
  upload.single('image'),
  photoMiddleware.validateImage,
  validatePhotoUpload,
  photoController.uploadPhoto,
);

// Pegar fotos por paginação
router.get('/', authMiddleware.verifyToken, photoController.getPhotosByPage);

module.exports = router;
