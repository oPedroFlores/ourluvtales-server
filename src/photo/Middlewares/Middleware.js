const Photo = require('../DataModel');
const { getCoupleIdByUserId } = require('../../couple_member/Controller');
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

module.exports.validateImageIfSended = (req, res, next) => {
  const file = req.file;
  if (file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: 'Formato de imagem INVÁLIDO! É aceito apenas JPEG, PNG e GIF',
        success: false,
      });
    }
  }

  next();
};

// Verificar se a photo id enviada pertence ao casal deste usuario
module.exports.doestPhotoIdBelongToCouple = async (req, res, next) => {
  const photoId = req.params.id;
  const userId = req.user.id;
  const coupleId = await getCoupleIdByUserId(userId);
  req.coupleId = coupleId;
  const photo = await Photo.findOne({ where: { id: photoId, coupleId } });
  if (!photo) {
    return res.status(400).json({
      error: 'Photo not found',
      success: false,
    });
  }
  req.photo = photo;
  next();
};
