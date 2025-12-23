import mongoose, { Schema } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password: string;
    tokens: { token: string }[]
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина логина 2 символа'],
    maxlength: [30, 'Максимальная длина логина 30 символов'],
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: [6, 'Минимальная длина пароля 6 символов'],
    required: true,
    select: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
        select: false,
      },
    },
  ],
});

export default mongoose.model<IUser>('user', userSchema);
