import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';

const upload = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new BadRequestError('Файл не загружен'));
    }
    return res.status(200).send({
      fileName: `/images/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch (error) {
    return next(error);
  }
};

export default upload;
