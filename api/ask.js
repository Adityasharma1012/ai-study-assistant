import { applyCors, callGemini, parseJsonBody } from './_gemini.js';

const SYSTEM_PROMPT = `You are StudyMind AI, a clear, structured academic tutor built for Computer Science & Engineering college students.
Format answers in clean GitHub-flavored Markdown with helpful headings, bullet points, concise code examples when useful, and exam-focused tips. Avoid unnecessary fluff.`;

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = await parseJsonBody(req);
    const prompt = String(body?.prompt || '').trim();
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Convert recent chat history into Gemini contents format while keeping the final turn as the current user prompt.
    const recentHistory = history
      .slice(-8)
      .filter((item) => item && typeof item.text === 'string' && item.text.trim())
      .map((item) => ({
        role: item.sender === 'ai' || item.role === 'model' ? 'model' : 'user',
        parts: [{ text: item.text.trim() }],
      }));

    // Ensure the conversation ends with the current user prompt (avoid duplicate trailing user message).
    const lastEntry = recentHistory[recentHistory.length - 1];
    const contents =
      lastEntry &&
      lastEntry.role === 'user' &&
      lastEntry.parts[0]?.text === prompt
        ? recentHistory
        : [...recentHistory, { role: 'user', parts: [{ text: prompt }] }];

    const { text, model } = await callGemini({
      contents,
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.65,
      maxOutputTokens: 2048,
    });

    return res.status(200).json({
      text,
      model,
      source: 'Gemini Live API',
    });
  } catch (err) {
    console.error('Error in /api/ask:', err);
    return res.status(err.statusCode || 500).json({
      error: err.message || 'Failed to generate AI response.',
    });
  }
}
