import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import { AUTH_SECRET } from '../config';

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

const auth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new UnauthorizedError('Пользователь не авторизован'));
    }

    const token = authHeader.split(' ')[1];

    req.user = jwt.verify(token, AUTH_SECRET) as { _id: string };

    return next();
  } catch (error) {
    return next(
      new UnauthorizedError('Недействительный или просроченный токен'),
    );
  }
};

export default auth;
