import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Readable } from 'stream';
import { OpenAI } from 'openai';

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

async function askGptForDescription(base64Image) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a professional image description generator. Describe the given image in detail.',
      },
      {
        role: 'user',
        content: `Describe this image: data:image/jpeg;base64,${base64Image}`,
      },
    ],
    max_tokens: 60,
    temperature: 1,
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
      const getObjectParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: item.Key,
      };
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const { Body } = await s3Client.send(getObjectCommand);
      const buffer = await streamToBuffer(Body);

      const base64Image = buffer.toString('base64');
      const description = await askGptForDescription(base64Image);

      descriptions.push(description.trim());
    }

    return NextResponse.json({ descriptions });
  } catch (error) {
    console.error("Error generating descriptions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
