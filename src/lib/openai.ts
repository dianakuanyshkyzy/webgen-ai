import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function askGpt(prompt: any) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are professional gift card website generator. You have to generate wishes JSON data',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: {
      type: 'json_object',
    },
    max_tokens: 1024,
    temperature: 0.5,
  });
  return response.choices[0].message.content;
}

export default askGpt;
