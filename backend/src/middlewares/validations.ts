import { Joi, Segments, celebrate } from 'celebrate';

export const validateProductBody = celebrate(
  {
    [Segments.BODY]: Joi.object({
      title: Joi.string().min(2).max(30).required(),
      image: Joi.object({
        fileName: Joi.string().required(),
        originalName: Joi.string().required(),
      }).required(),
      category: Joi.string().required(),
      description: Joi.string().optional(),
      price: Joi.number().allow(null),
    }),
  },
  { abortEarly: false },
);

export const validateOrderBody = celebrate(
  {
    [Segments.BODY]: Joi.object({
      payment: Joi.string().valid('card', 'online').required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      total: Joi.number().required(),
      items: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
    }),
  },
  { abortEarly: false },
);

export const validateUserRegisterBody = celebrate(
  {
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  },
  { abortEarly: false },
);

export const validateUserLoginBody = celebrate(
  {
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  { abortEarly: false },
);
