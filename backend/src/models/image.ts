import { Schema } from 'mongoose';

export interface IImage {
  fileName: string;
  originalName: string;
}

export const imageSchema = new Schema<IImage>(
  {
    fileName: { type: String, required: [true, 'Имя файла обязательно'] },
    originalName: {
      type: String,
      required: [true, 'Название файла обязательно'],
    },
  },
  { _id: false },
);
