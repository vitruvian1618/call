import { getEnv } from './env.js';

export const appConfig = {
  port: getEnv().PORT,
  clientUrl: getEnv().CLIENT_URL,
  apiPrefix: '/api',
};
