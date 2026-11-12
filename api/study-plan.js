import { applyCors, callGemini, extractJson, parseJsonBody } from './_gemini.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = await parseJsonBody(req);
    const subject = String(body?.subject || 'Computer Science').trim();
    const topics = String(body?.topics || '').trim();
    const daysCount = Math.max(2, Math.min(14, Number(body?.daysCount || 4)));
    const hoursPerDay = Math.max(1, Math.min(12, Number(body?.hoursPerDay || 4)));
    const difficulty = String(body?.difficulty || 'Intermediate').trim();

    if (!topics) {
      return res.status(400).json({ error: 'Topics are required.' });
    }

    const prompt = `Create a ${daysCount}-day college exam revision plan:
- Subject: ${subject}
- Focus Topics: ${topics}
- Daily Study Hours: ${hoursPerDay}
- Intensity: ${difficulty}

Generate 2 focused tasks per day (1 morning deep theory/problem task, 1 afternoon active recall/mock task), total ${daysCount * 2} tasks.
Return strictly valid JSON matching this exact structure:
{
  "summary": "1-2 sentence summary of the study plan",
  "tasks": [
    {
      "dayNumber": 1,
      "title": "Specific actionable study task title",
      "topic": "Primary topic for this session",
      "priority": "High",
      "estimatedTime": "90 mins",
      "timeRange": "09:00 AM - 10:30 AM",
      "type": "Deep Theory Review"
    }
  ]
}
Use priority values from ["High", "Medium", "Normal"].`;

    const { text: raw, model } = await callGemini({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: 'You are an expert academic study planner generating realistic JSON study schedules.',
      responseMimeType: 'application/json',
      temperature: 0.5,
      maxOutputTokens: 2500,
    });

    const parsed = extractJson(raw);
    const tasks = Array.isArray(parsed?.tasks) ? parsed.tasks : [];

    return res.status(200).json({
      summary: parsed?.summary || '',
      tasks,
      model,
      source: 'Gemini Live API',
    });
  } catch (err) {
    console.error('Error in /api/study-plan:', err);
    return res.status(err.statusCode || 500).json({
      error: err.message || 'Failed to generate study plan.',
    });
  }
}
