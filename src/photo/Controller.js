const { getCoupleIdByUserId } = require('../couple_member/Controller');
const { handleImageUpload, deleteImageS3, getImageS3 } = require('../S3');
const Photo = require('./DataModel');
const User = require('../user/DataModel');
const exifParser = require('exif-parser'); // Importando o exif-parser
const { getUserNameById } = require('../user/Service');

module.exports.uploadPhoto = async (req, res) => {
  try {
    //! PEGAR O COUPLE ID
    const coupleId = await getCoupleIdByUserId(req.user.id);
    if (!coupleId) {
      return res
        .status(400)
        .json({ error: 'Couple ID não encontrado.', success: false });
    }

    //! PEGAR O UPLOADED_BY
    const uploadedBy = req.user.id;

    //! PEGAR O CAPTION (LEGENDA)
    const caption = req.body.caption;

    //! PEGAR A DATA DE CRIAÇÃO
    let imageDate = req.body.imageDate;

    //! PEGAR O ARQUIVO
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ error: 'Faltando imagem.', success: false });
    }

    //! pegar location
    const location = req.body.location;

    //! Se a data não foi fornecida, tentar extrair dos metadados
    if (!imageDate) {
      try {
        const parser = exifParser.create(file.buffer);
        const result = parser.parse();

        if (result.tags && result.tags.DateTimeOriginal) {
          // DateTimeOriginal é um timestamp UNIX em segundos
          imageDate = new Date(result.tags.DateTimeOriginal * 1000);
        } else if (result.tags && result.tags.CreateDate) {
          imageDate = new Date(result.tags.CreateDate * 1000);
        } else if (result.tags && result.tags.ModifyDate) {
          imageDate = new Date(result.tags.ModifyDate * 1000);
        } else {
          // Se não encontrou a data nos metadados, usa a data atual
          imageDate = new Date();
        }
      } catch (error) {
        console.error('Erro ao analisar os metadados EXIF:', error);
        // Se ocorrer um erro ao ler os metadados, usa a data atual
        imageDate = new Date();
      }
    } else {
      // Se a imagemDate foi fornecida, converte para objeto Date
      imageDate = new Date(imageDate);
    }

    //! Fazer upload da foto para o S3
    const newImageUrl = await handleImageUpload(file, null);

    //! Salvar no banco de dados
    const photo = await Photo.create({
      coupleId,
      uploadedBy,
      caption,
      location,
      dateTaken: imageDate,
      photoUrl: newImageUrl,
    });

    return res.status(201).json({ photo, success: true });
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    return res
      .status(500)
      .json({ error: 'Erro interno no servidor.', success: false });
  }
};

module.exports.getPhotosByPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  //! Pegar o coupleId pelo userId
  try {
    const coupleId = await getCoupleIdByUserId(req.user.id);
    const { rows, count } = await Photo.findAndCountAll({
      where: { coupleId },
      limit,
      offset,
      order: [['dateTaken', 'DESC']],
      include: [
        {
          model: User,
          as: 'Uploader',
          attributes: ['firstName', 'lastName'],
        },
      ],
    });
    let PhotosData = [];

    for (let [index, photo] of rows.entries()) {
      //* Pegando URL da imagem
      photo.photoUrl = await getImageS3(photo.photoUrl);

      PhotosData[index] = {
        id: photo.id,
        dateTaken: photo.dateTaken,
        caption: photo.caption,
        location: photo.location,
        photoUrl: photo.photoUrl,
        uploader: photo.Uploader,
      };
    }

    return res
      .status(200)
      .json({ photos: PhotosData, amount: count, page, success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};
