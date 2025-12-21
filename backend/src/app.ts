/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import { errorLogger, requestLogger } from './middlewares/logger';
import { PORT, DB_ADDRESS, ORIGIN_ALLOW } from './config';
import routes from './routes';
import errorHandler from './middlewares/error-handler';

const app = express();

mongoose.connect(DB_ADDRESS)
  .then(() => console.log('БД подключена'))
  .catch((err) => console.error('Ошибка подключения БД: ', err));

app.use(cors({
  origin: ORIGIN_ALLOW,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
