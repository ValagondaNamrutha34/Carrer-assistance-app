const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat(systemPrompt, userPrompt) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { chat };
