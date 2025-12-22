import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/not-found-error';

const NotFoundRoute = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Такого маршрута не существует'));
};

export default NotFoundRoute;
