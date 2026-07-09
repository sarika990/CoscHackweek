import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = {
    profileImage: ['.jpg', '.jpeg', '.png', '.webp'],
    images: ['.jpg', '.jpeg', '.png', '.webp'],
    video: ['.mp4'],
    pdf: ['.pdf'],
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const fieldName = file.fieldname;

  if (allowedExtensions[fieldName] && allowedExtensions[fieldName].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for field '${fieldName}'. Allowed extensions: ${allowedExtensions[fieldName].join(', ')}`), false);
  }
};

const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB max overall file size limit (mainly for video)
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});

// Helper middleware to handle field size limits specifically
export const uploadFields = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);
