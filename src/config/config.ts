import { ConfigProps } from './config.types';

export const config = (): ConfigProps => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
  },
  swapi: process.env.SWAPI_URL,
});
