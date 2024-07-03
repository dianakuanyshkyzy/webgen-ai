import prisma from '@/lib/db';
import askGpt from '@/lib/openai';

export async function POST(request: Request) {
  const formData = await request.formData();
  const context = formData.get('context');
  //   const images = formData.get('images');
  //   const video = formData.get('video');

  const prompt = `Generate a birthday gift card with the following context: ${context}`;
  const response = await askGpt(prompt);

  console.log(response);

  if (response) {
    const { id } = await prisma.wish.create({
      data: {
        wishData: JSON.parse(response),
      },
    });

    return new Response(
      JSON.stringify({ url: `http://localhost:3000/${id}` }),
      {
        status: 200,
      }
    );
  }
  return new Response(
    JSON.stringify({ error: 'Failed to generate gift card' }),
    {
      status: 500,
    }
  );
}
