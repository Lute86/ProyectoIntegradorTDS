import multer from 'multer';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import mkdirp from 'mkdirp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = process.env.UPLOAD_DIR || join(__dirname, '../../uploads');
mkdirp.sync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extOk = allowedTypes.test(extname(file.originalname).toLowerCase());
  const mimetypeOk = allowedTypes.test(file.mimetype);

  if (mimetypeOk && extOk) {
    return cb(null, true);
  }
  cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
  },
});

export default upload;
