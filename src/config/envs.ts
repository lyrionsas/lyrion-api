import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  HOST: string;
  PORT: number;
  FRONTEND_URL: string;

  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;

  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;

  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;

  SWAGGER_USER: string;
  SWAGGER_PASSWORD: string;

  API_KEY_TRON: string;

  APP_ENV: 'development' | 'production' | 'QA';
}

const envVarsSchema = joi.object<EnvVars>({
  HOST: joi.string().required(),
  PORT: joi.number().default(3000),
  FRONTEND_URL: joi.string().uri().required(),

  JWT_SECRET: joi.string().min(32).required(),
  JWT_EXPIRATION_TIME: joi.string().required(),

  POSTGRES_HOST: joi.string().required(),
  POSTGRES_PORT: joi.string().required(),
  POSTGRES_USER: joi.string().required(),
  POSTGRES_PASSWORD: joi.string().required(),
  POSTGRES_DB: joi.string().required(),

  EMAIL_HOST: joi.string().required(),
  EMAIL_PORT: joi.number().required(),
  EMAIL_USER: joi.string().required(),
  EMAIL_PASSWORD: joi.string().required(),

  SWAGGER_USER: joi.string().required(),
  SWAGGER_PASSWORD: joi.string().required(),

  API_KEY_TRON: joi.string().required(),

  APP_ENV: joi.string().valid('development', 'production', 'QA').default('development'),
}).unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error?.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  HOST: envVars.HOST,
  PORT: envVars.PORT,
  FRONTEND_URL: envVars.FRONTEND_URL,

  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRATION_TIME: envVars.JWT_EXPIRATION_TIME,

  POSTGRES_HOST: envVars.POSTGRES_HOST,
  POSTGRES_PORT: envVars.POSTGRES_PORT,
  POSTGRES_USER: envVars.POSTGRES_USER,
  POSTGRES_PASSWORD: envVars.POSTGRES_PASSWORD,
  POSTGRES_DB: envVars.POSTGRES_DB,

  EMAIL_HOST: envVars.EMAIL_HOST,
  EMAIL_PORT: envVars.EMAIL_PORT,
  EMAIL_USER: envVars.EMAIL_USER,
  EMAIL_PASSWORD: envVars.EMAIL_PASSWORD,

  SWAGGER_USER: envVars.SWAGGER_USER,
  SWAGGER_PASSWORD: envVars.SWAGGER_PASSWORD,

  API_KEY_TRON: envVars.API_KEY_TRON,

  APP_ENV: envVars.APP_ENV,
};
