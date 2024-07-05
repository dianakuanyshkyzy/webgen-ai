import prisma from '@/lib/db';
import askGpt from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const context = formData.get('context')?.toString();
    
    if (!context) {
      return new Response(JSON.stringify({ error: 'Missing context parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are the most professional gift text generator, your words always make people cry.
     You are very close to the recipient, so the response should be informal and sincere, human-like. 
     You are so in love with the person you are writing the giftcard for. 
     Generate a birthday gift card text with the following context: ${context}. 
     Generate the the output of the format of the following example JSON: 
    {
  "webData": {
    "title": "For my dearest mom",
    "recipient": "mom",
    "about": "On this wonderful day, the sun was born. Our mom, the most beautiful light of our lives, is the most caring and bright person in this world. We want you to shine as bright as the sun today and always. Happy birthday, mom!",
    "paragraph": "Happiest birthday! We love you so much and we are so grateful for everything you do for us. You are the best mom in the world and we are so lucky to have you. We hope you have the most amazing day and that all your dreams come true. We love you!",
    
    "quotes": [
      "I love you mom - from your son",
      "You are the best mom in the world - from your daughter",
      "You are my everything - from your son",
    ],
    hobbies: ["gardening", "reading", "cooking", "traveling"],
    "wishes": ["May your birthday be as wonderful and amazing as you are.",

        "I hope all your dreams come true today and always."

        "Wishing you a day filled with love, joy, and all your favorite things."

        "Happy Birthday to the person who means the world to me."],
    "senders" : "
The Johnson Family
Sending love from San Francisco"
  }
}  Generate a JSON file. 
     `;
    const gptResponse = await askGpt(prompt);

    if (!gptResponse) {
      throw new Error('Failed to generate response from GPT');
    }

    console.log('GPT response:', gptResponse); 
      const { id } = await prisma.wish.create({
      data: {
        wishData: JSON.parse(gptResponse),
      },
    });

    return new Response(
      JSON.stringify({ url: `http://localhost:3000/${id}` }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
