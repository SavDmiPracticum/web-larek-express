import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import { UPLOAD_PATH_TEMP } from '../config';
import BadRequestError from '../errors/bad-request-error';

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

if (!fs.existsSync(UPLOAD_PATH_TEMP)) {
  fs.mkdirSync(UPLOAD_PATH_TEMP, { recursive: true });
}

const fileFilter = (_req: Request, file: any, fc: FileFilterCallback) => {
  if (!allowedTypes.includes(file.mimetype)) {
    fc(new BadRequestError('Допустимые типы файлов: png, jpg, jpeg'));
  } else {
    fc(null, true);
  }
};

const storage = multer.diskStorage({
  destination(_req, _file, fc) {
    fc(null, UPLOAD_PATH_TEMP);
  },
  filename(_req, file, fc) {
    const uniqueName = faker.string.uuid();
    const fileExtension = path.extname(file.originalname);
    fc(null, uniqueName + fileExtension);
  },
});

const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },

});

export default uploadFile;
