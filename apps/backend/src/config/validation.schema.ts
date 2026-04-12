// import * as Joi from 'joi'; // Joi is a popular validation library for JavaScript/TypeScript.

// export const validationSchema = Joi.object({
//   DB_PORT: Joi.number().required(), // This must be a number (like 5432). If you put DB_PORT=abc in your .env, Joi will throw an error.
//   DB_HOST: Joi.string().required(), // This must be a string (like localhost or 127.0.0.1).
//   // These below three lines ensures you have credentials and a database name ready before TypeORM tries to connect.
//   DB_USER: Joi.string().required(),
//   DB_PASSWORD: Joi.string().required(),
//   DB_NAME: Joi.string().required(),
//   JWT_SECRET: Joi.string().required(),
// });

import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DB_URL: Joi.string().required(),

  PORT: Joi.number().optional(),

  JWT_SECRET: Joi.string().required(),

  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
});