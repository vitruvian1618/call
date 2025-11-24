import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { Interview } from '../models/interview.model.js';
import { logger } from '../utils/logger.js';

const dataDir = join(process.cwd(), '..', 'data', 'interviews');

export const saveInterview = async (interview: Interview) => {
  await mkdir(dataDir, { recursive: true });
  const filePath = join(dataDir, `${interview.id}.json`);
  await writeFile(filePath, JSON.stringify(interview, null, 2), 'utf-8');
  logger.info('Interview saved', filePath);
};
