export const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

const FALLBACK_MODELS = [
  DEFAULT_MODEL,
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
].filter((model, idx, arr) => Boolean(model) && arr.indexOf(model) === idx);

export const GEMINI_MODEL = DEFAULT_MODEL;

export function applyCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

export async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body);
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

export function extractJson(rawText) {
  const cleaned = String(rawText || '')
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

export async function callGemini({
  contents,
  systemInstruction,
  responseMimeType,
  temperature = 0.6,
  maxOutputTokens = 2048,
}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured on the server.');
    err.statusCode = 500;
    throw err;
  }

  const payload = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens,
      ...(responseMimeType ? { responseMimeType } : {}),
    },
    ...(systemInstruction
      ? {
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
        }
      : {}),
  };

  let lastError = null;

  for (const model of FALLBACK_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data?.error?.message || `Gemini API failed with status ${response.status}`;
        const err = new Error(message);
        err.statusCode = response.status;
        lastError = err;

        // Fail fast on authentication / permission / malformed payload errors
        if (response.status === 400 || response.status === 401 || response.status === 403) {
          throw err;
        }
        // Retry next model on 404, 429, 500, 503, etc.
        continue;
      }

      const text = (data?.candidates?.[0]?.content?.parts || [])
        .map((part) => part.text || '')
        .join('')
        .trim();

      if (!text) {
        const err = new Error(`Model ${model} returned an empty response.`);
        err.statusCode = 502;
        lastError = err;
        continue;
      }

      return { text, model };
    } catch (err) {
      if (err.statusCode === 400 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError || new Error('All configured Gemini models failed.');
}
