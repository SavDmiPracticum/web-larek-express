import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';
import User from '../models/user';
import {
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_EXPIRY,
  AUTH_SECRET,
} from '../config';
import BadRequestError from '../errors/bad-request-error';
import UnauthorizedError from '../errors/unauthorized-error';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
      return next(
        new ConflictError('Пользователь с таким email уже существует'),
      );
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      tokens: [],
    });
    const accessToken = jwt.sign({ _id: user._id }, AUTH_SECRET, {
      expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
    } as SignOptions);
    const refreshToken = jwt.sign({ _id: user._id }, AUTH_SECRET, {
      expiresIn: AUTH_REFRESH_TOKEN_EXPIRY,
    } as SignOptions);

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms('7d'),
      path: '/',
    });

    res.status(201).send({
      success: true,
      user: { name: user.name, email: user.email, id: user._id },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError('Обязательные поля не заполнены'));
    }

    const user = await User.findOne({ email }).select('+password +tokens');
    if (!user) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    if (!await bcrypt.compare(password, user.password)) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const accessToken = jwt.sign({ _id: user._id }, AUTH_SECRET, {
      expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
    } as SignOptions);
    const refreshToken = jwt.sign({ _id: user._id }, AUTH_SECRET, {
      expiresIn: AUTH_REFRESH_TOKEN_EXPIRY,
    } as SignOptions);

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms('7d'),
      path: '/',
    });

    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) {
      return next(new UnauthorizedError('Токен не найден'));
    }

    const payload = jwt.verify(refreshToken, AUTH_SECRET) as { _id: string };
    const user = await User.findById(payload._id).select('+tokens');
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
    await user.save();

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Токен не предоставлен'));
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, AUTH_SECRET) as { _id: string };
    const user = await User.findById(payload._id);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    res.status(200).send({
      success: true,
      user: { name: user.name, email: user.email, id: user._id },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) {
      return next(new BadRequestError('Токен не найден'));
    }

    const payload = jwt.verify(refreshToken, AUTH_SECRET) as { _id: string };
    const user = await User.findById(payload._id).select('+tokens');
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    const token = user.tokens.some((t) => t.token === refreshToken);
    if (!token) {
      return next(new UnauthorizedError('Токен не найден'));
    }

    const newAccessToken = jwt.sign({ _id: user._id }, AUTH_SECRET, {
      expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
    } as SignOptions);
    const newRefreshToken = jwt.sign({ _id: user._id }, AUTH_SECRET, {
      expiresIn: AUTH_REFRESH_TOKEN_EXPIRY,
    } as SignOptions);

    user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
    user.tokens.push({ token: newRefreshToken });
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms('7d'),
      path: '/',
    });

    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
