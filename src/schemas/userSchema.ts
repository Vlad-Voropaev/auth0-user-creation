import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  connection: Joi.string().required(),
  user_id: Joi.string(),
  email_verified: Joi.boolean(),
  blocked: Joi.boolean(),
  verify_email: Joi.boolean(),
  app_metadata: Joi.object({
    imported: Joi.boolean(),
  }),
});