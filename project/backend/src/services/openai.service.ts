import axios from 'axios';
import { getEnv } from '../config/env.js';

const OPENAI_BASE_URL = 'https://api.openai.com/v1';

export const synthesizeSpeech = async (text: string, voice = 'nova') => {
  const { OPENAI_API_KEY } = getEnv();
  const url = `${OPENAI_BASE_URL}/audio/speech`;
  const response = await axios.post(
    url,
    {
      model: 'tts-1-hd',
      voice,
      input: text,
      speed: 0.9,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    }
  );
  return Buffer.from(response.data);
};

type MappingFunction = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

const mappingTool: MappingFunction = {
  name: 'map_codes',
  description: 'Map transcript into relevant survey codes with optional confidence.',
  parameters: {
    type: 'object',
    properties: {
      codes: { type: 'array', items: { type: 'string' } },
      confidence: { type: 'number' },
    },
    required: ['codes'],
  },
};

export const mapTranscriptToCodes = async (
  transcript: string,
  options?: string[],
  questionCode?: string
): Promise<{ codes: string[]; confidence?: number }> => {
  const { OPENAI_API_KEY } = getEnv();
  const url = `${OPENAI_BASE_URL}/chat/completions`;
  const system =
    'Iz odgovora izberi najprimernejše kode vprašanja in vrni jih v JSON funkcijo.';
  const promptParts = [
    `Besedilo: ${transcript}`,
    questionCode ? `Koda vprašanja: ${questionCode}` : undefined,
    options && options.length ? `Možne kode: ${options.join(', ')}` : undefined,
  ].filter(Boolean);

  const response = await axios.post(
    url,
    {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: promptParts.join('\n') },
      ],
      tools: [
        {
          type: 'function',
          function: mappingTool,
        },
      ],
      tool_choice: { type: 'function', function: mappingTool.name },
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const toolCall = response.data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    return { codes: [] };
  }
  const parsed = JSON.parse(toolCall.function.arguments || '{}');
  return { codes: parsed.codes || [], confidence: parsed.confidence };
};
