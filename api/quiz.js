import { applyCors, callGemini, extractJson, parseJsonBody } from './_gemini.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = await parseJsonBody(req);
    const subject = String(body?.subject || 'Computer Science').trim();
    const topic = String(body?.topic || '').trim();
    const count = Math.max(1, Math.min(10, Number(body?.count || body?.questionCount || 5)));
    const difficulty = String(body?.difficulty || 'Intermediate').trim();

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const prompt = `Generate exactly ${count} multiple-choice questions for a college Computer Science quiz:
- Subject: ${subject}
- Topic: ${topic}
- Difficulty: ${difficulty}

Return strictly valid JSON matching this exact structure:
{
  "questions": [
    {
      "topic": "Specific subtopic name",
      "question": "Clear MCQ question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear explanation of why the correct option is right."
    }
  ]
}
Ensure every question has 4 options and correctIndex is an integer between 0 and 3.`;

    const { text: raw, model } = await callGemini({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: 'You are an expert Computer Science exam writer generating accurate MCQs in valid JSON only.',
      responseMimeType: 'application/json',
      temperature: 0.5,
      maxOutputTokens: 2500,
    });

    const parsed = extractJson(raw);
    const questions = Array.isArray(parsed?.questions) ? parsed.questions : [];

    return res.status(200).json({
      questions,
      model,
      source: 'Gemini Live API',
    });
  } catch (err) {
    console.error('Error in /api/quiz:', err);
    return res.status(err.statusCode || 500).json({
      error: err.message || 'Failed to generate quiz.',
    });
  }
}
