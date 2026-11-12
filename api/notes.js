import { applyCors, callGemini, extractJson, parseJsonBody } from './_gemini.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = await parseJsonBody(req);
    const topic = String(body?.topic || '').trim();
    const subject = String(body?.subject || 'Computer Science').trim();
    const difficulty = String(body?.difficulty || 'Intermediate').trim();
    const length = String(body?.length || 'Standard').trim();

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const prompt = `Generate structured college study notes for:
- Subject: ${subject}
- Topic: ${topic}
- Difficulty: ${difficulty}
- Detail Length: ${length}

Return strictly valid JSON matching this exact structure:
{
  "overview": "2-4 sentence clear overview paragraph",
  "keyConcepts": [
    { "name": "Concept Title", "desc": "Clear explanation" }
  ],
  "definitions": [
    { "term": "Key Term", "definition": "Concise exam-ready definition" }
  ],
  "examples": [
    { "title": "Example Title", "code": "Clean pseudocode or code snippet or worked example" }
  ],
  "keyPoints": [
    "High-yield takeaway bullet 1"
  ],
  "summary": "Short concluding summary paragraph",
  "questions": [
    { "q": "Important exam question?", "a": "Concise, complete answer." }
  ]
}
Provide 3-4 keyConcepts, 3 definitions, 1-2 examples, 4 keyPoints, and 3 questions.`;

    const { text: raw, model } = await callGemini({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: 'You are an expert Computer Science professor generating structured JSON study notes. Output only valid JSON.',
      responseMimeType: 'application/json',
      temperature: 0.45,
      maxOutputTokens: 2500,
    });

    const parsed = extractJson(raw);

    return res.status(200).json({
      ...parsed,
      model,
      source: 'Gemini Live API',
    });
  } catch (err) {
    console.error('Error in /api/notes:', err);
    return res.status(err.statusCode || 500).json({
      error: err.message || 'Failed to generate study notes.',
    });
  }
}
