import OpenAI from "openai";
import { Lyric } from "./types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateSongLyric(userPrompt: string): Promise<Lyric | undefined> {
  const systemPrompt = `You are a professional song writer. Generate a song lyric based on the user-given prompt. 
  Return the response in JSON format with "song_lyric", "song_name", and "tags". The tags should be descriptive of the song's style.`;

  try {
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 1,
    });

    const resJson: string | null = gptResponse.choices[0]?.message?.content;
    if (!resJson) {
      return undefined;
    }
    const resObj = JSON.parse(resJson);
    return resObj as Lyric;

  } catch (error: any) {
    console.error('Error generating song lyric:', error.message);
    return undefined;
  }
}
