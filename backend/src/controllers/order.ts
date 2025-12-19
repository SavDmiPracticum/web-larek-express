import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      payment, email, phone, address, total, items,
    } = req.body;

    if (!payment || !email || !phone || !address || !total || !items?.length) { return next(new BadRequestError('Обязательные поля не заполнены')); }

    const products = await Product.find({ _id: { $in: items } });
    if (products.length !== items.length) { return next(new BadRequestError('Товары не найдены')); }
    if (products.some((product) => product.price === null)) { return next(new BadRequestError('Часть товаров не доступна для заказа')); }
    if (products.reduce((acc, product) => acc + product.price!, 0) !== total) { return next(new BadRequestError('Неверная сумма заказа')); }
    if (!['card', 'online'].includes(payment)) { return next(new BadRequestError('Неверный способ оплаты')); }

    const orderId = faker.string.uuid();

    return res.status(200).send({
      id: orderId,
      total,
    });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
