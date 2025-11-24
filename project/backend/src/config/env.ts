import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
  // Do not throw when .env is missing; rely on process.env defaults and surface errors lazily.
}

export type EnvKeys = {
  PORT: number;
  OPENAI_API_KEY: string;
  SONIOX_API_KEY: string;
  CLIENT_URL: string;
};

const defaults: Partial<EnvKeys> = {
  PORT: 3001,
};

export const getEnv = (): EnvKeys => {
  const { PORT, OPENAI_API_KEY, SONIOX_API_KEY, CLIENT_URL } = process.env;

  return {
    PORT: Number(PORT || defaults.PORT),
    OPENAI_API_KEY: OPENAI_API_KEY || '',
    SONIOX_API_KEY: SONIOX_API_KEY || '',
    CLIENT_URL: CLIENT_URL || 'http://localhost:5173',
  };
};
