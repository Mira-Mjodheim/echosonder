/**
 * AI service for echosonder — mood detection & discovery by emotional similarity.
 * Calls DeepSeek API (OpenAI-compatible).
 */
const DEEPSEEK_BASE = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;

let fetch;
try { fetch = require('node-fetch'); } catch { fetch = global.fetch; }

const VALID_MOODS = ['joie', 'mélancolie', 'calme', 'énergie', 'nostalgie', 'mystère', 'autre'];

/**
 * Detect the emotional mood of a content piece using the LLM.
 * Returns a mood from VALID_MOODS.
 */
async function detectMood(title, description) {
  if (!DEEPSEEK_KEY) return 'autre';

  const prompt = `Analyze the emotional tone of this audio piece and return ONLY ONE word from this list: ${VALID_MOODS.join(', ')}.

Title: ${title}
Description: ${description || '(none)'}

Return just the mood word, nothing else.`;

  try {
    const resp = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You return a single mood word from a fixed list. Never use markdown.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 10,
      }),
    });

    if (!resp.ok) return 'autre';
    const data = await resp.json();
    const mood = (data.choices?.[0]?.message?.content || '').toLowerCase().trim();
    return VALID_MOODS.includes(mood) ? mood : 'autre';
  } catch {
    return 'autre';
  }
}

/**
 * Generate an embedding for discovery (content similarity).
 */
async function embed(text) {
  if (!DEEPSEEK_KEY) return bowEmbed(text);

  try {
    const resp = await fetch(`${DEEPSEEK_BASE}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        input: text.slice(0, 8000),
      }),
    });

    if (!resp.ok) return bowEmbed(text);
    const data = await resp.json();
    return data.data?.[0]?.embedding || bowEmbed(text);
  } catch {
    return bowEmbed(text);
  }
}

function bowEmbed(text) {
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 1);
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const vec = new Array(256).fill(0);
  for (const [word, count] of Object.entries(freq)) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) hash = ((hash << 5) - hash + word.charCodeAt(i)) | 0;
    vec[Math.abs(hash) % 256] += count;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map(v => v / norm);
}

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

module.exports = { detectMood, embed, cosineSimilarity };
