import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import path from 'path';
import fs from 'fs';
import { UPLOAD_PATH_TEMP, UPLOAD_PATH } from '../config';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

const moveImageFromTemp = (fileName: string): void => {
  if (!fileName) return;
  const fileBaseName = path.basename(fileName);
  const tempPath = path.join(UPLOAD_PATH_TEMP, fileBaseName);
  const targetDir = path.join('public', UPLOAD_PATH, fileBaseName);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  fs.copyFileSync(tempPath, targetDir);
  fs.unlinkSync(tempPath);
};

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find();
    return res.status(200).send({ items: products, total: products.length });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = req.body;
    if (!product.title || !product.image) {
      return next(
        new BadRequestError('Название и изображение товара должны быть указаны'),
      );
    }
    const newProduct = await Product.create(product);
    if (product.image && product.image.fileName) {
      moveImageFromTemp(product.image.fileName);
    }
    return res.status(201).send(newProduct);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Ошибка валидации'));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    return next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const product = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, product, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return next(new BadRequestError('Нет товара по заданному id'));
    }
    if (product.image && product.image.fileName) {
      moveImageFromTemp(product.image);
    }
    return res.status(200).send(updatedProduct);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Передан не валидный ID товара'));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    return next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return next(new NotFoundError('Нет товара по заданному id'));
    }
    return res.status(200).send(deletedProduct);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Передан не валидный ID товара'));
    }
    return next(error);
  }
};
