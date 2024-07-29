import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { OpenAI } from 'openai';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function askGptForDescription(imageUrl) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'To ensure the image description matches the image itself accurately, describe the image based on the base64 data provided. Provide a detailed description of the persons features in the image. You are an expert prompt engineer and image description generator. Focus on providing a concise, detailed description of the person and relevant background elements that are essential for creating a cartoon-styled image. Include key features such as facial characteristics, clothing, accessories, and significant background details. The output should be in a clear, concise, short. Style it in cartoon-like way. Be super precise, focus on colors of the eyes,hair, skin, and clothing. Provide the description in a way that is easy to understand and can be used to create a cartoon image. Use keywords. Like, "woman with great black wavy long hair, wearing a red dress, and holding a bouquet of flowers.' },
          { type: 'image_url', image_url: { url: imageUrl } }
        ],
      }
    ],
    max_tokens: 300,
  });
  return response.choices[0].message.content;
}

export async function POST(req) {
  try {
    const { id } = await req.json();
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: `${id}/images/`,
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    const descriptions = [];

    for (const item of response.Contents) {
      const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
      const description = await askGptForDescription(imageUrl);
      descriptions.push(description.trim());
    }

    return NextResponse.json({ descriptions });
  } catch (error) {
    console.error("Error generating descriptions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}