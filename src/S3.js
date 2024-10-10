const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');
const imageConfig = require('./imageConfig.json');

const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

async function uploadImageS3(file, buffer, oldImageKey) {
  const MAX_FILENAME_LENGTH = 50; //* Define o número máximo de caracteres para o nome da imagem
  try {
    const uniqueId = uuidv4().slice(0, MAX_FILENAME_LENGTH - 4); //* Pega os últimos 4 caracteres para manter o formato da imagem
    const ext = file.originalname.split('.').pop(); //* Pega a extensão do arquivo
    const uniqueFilename = `${uniqueId}.${ext}`;
    const params = {
      Bucket: bucketName,
      Key: oldImageKey || uniqueFilename,
      Body: buffer || file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    return {
      key: uniqueFilename,
      response: response,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

const handleImageUpload = async (file, existingImage) => {
  try {
    if (existingImage) {
      await deleteImageS3(existingImage);
    }

    const buffer = await sharp(file.buffer)
      .resize({
        height: imageConfig.defaultSize.height || 1024,
        width: imageConfig.defaultSize.width || 1024,
        fit: 'cover',
      })
      .toBuffer();
    const result = await uploadImageS3(file, buffer);
    return result.key || null;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

async function getImageS3(key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}

async function deleteImageS3(key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  const command = new DeleteObjectCommand(params);
  const response = await s3.send(command);
  return response;
}

module.exports = {
  uploadImageS3,
  handleImageUpload,
  getImageS3,
  deleteImageS3,
};
