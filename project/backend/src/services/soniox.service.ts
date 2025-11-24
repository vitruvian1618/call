import axios from 'axios';
import FormData from 'form-data';
import { getEnv } from '../config/env.js';

const SONIOX_BASE_URL = 'https://api.soniox.com';

const withAuthHeaders = () => ({
  Authorization: `Bearer ${getEnv().SONIOX_API_KEY}`,
});

export const transcribeAudio = async (buffer: Buffer, filename: string) => {
  if (!buffer || buffer.length === 0) {
    throw new Error('Audio buffer is empty');
  }

  const uploadForm = new FormData();
  uploadForm.append('file', buffer, { filename });

  const uploadRes = await axios.post(`${SONIOX_BASE_URL}/v2/media`, uploadForm, {
    headers: { ...uploadForm.getHeaders(), ...withAuthHeaders() },
  });

  if (!uploadRes.data?.media_id) {
    throw new Error(`Soniox upload failed: ${JSON.stringify(uploadRes.data)}`);
  }

  const transcriptionRes = await axios.post(
    `${SONIOX_BASE_URL}/v2/transcribe`,
    { media_id: uploadRes.data.media_id },
    { headers: withAuthHeaders() }
  );

  if (!transcriptionRes.data?.transcription_id) {
    throw new Error(`Soniox transcription creation failed: ${JSON.stringify(transcriptionRes.data)}`);
  }

  const transcriptionId = transcriptionRes.data.transcription_id;
  let attempts = 0;
  const maxAttempts = 10;
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  while (attempts < maxAttempts) {
    const statusRes = await axios.get(
      `${SONIOX_BASE_URL}/v2/transcriptions/${transcriptionId}`,
      { headers: withAuthHeaders() }
    );

    if (statusRes.data?.status === 'completed') {
      const text = statusRes.data?.text || '';
      return text;
    }

    if (statusRes.data?.status === 'failed') {
      throw new Error(`Soniox transcription failed: ${JSON.stringify(statusRes.data)}`);
    }

    attempts += 1;
    await delay(1000);
  }

  throw new Error('Soniox transcription timed out');
};
