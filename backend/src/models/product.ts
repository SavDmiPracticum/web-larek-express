import { model, Schema } from 'mongoose';
import { IImage, imageSchema } from './image';

export interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price: number | null;
}
const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    minlength: [2, 'Минимальная длина названия 2 символа'],
    maxlength: [30, 'Максимальная длина названия 30 символов'],
    unique: true,
    required: [true, 'Название обязательно'],
  },
  image: {
    type: imageSchema,
    required: [true, 'Изображение обязательно'],
  },
  category: {
    type: String,
    required: [true, 'Категория обязательна'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default model<IProduct>('product', productSchema);
