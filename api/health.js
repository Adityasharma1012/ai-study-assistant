import { applyCors, GEMINI_MODEL } from './_gemini.js';

export default function handler(req, res) {
  if (applyCors(req, res)) return;

  const configured = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  return res.status(200).json({
    ok: true,
    service: 'StudyMind AI Backend',
    model: GEMINI_MODEL,
    configured,
    timestamp: new Date().toISOString(),
  });
}
