import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import OpenAI from 'openai';
import fetch from 'node-fetch';

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

// Function to sanitize descriptions
const sanitizeDescription = (description) => {
  // Basic sanitization: remove special characters and limit length
  return description.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 100);
};

export async function POST(req) {
  try {
    const { descriptions, id } = await req.json();

    const generatedImages = [];

    for (const description of descriptions) {
      const sanitizedDescription = sanitizeDescription(description);

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: sanitizedDescription,
        n: 1,
        size: '1024x1024',
      });

      if (response.data && response.data[0] && response.data[0].url) {
        const imageUrl = response.data[0].url;
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.buffer();

        const s3Key = `${id}/generated-images/${sanitizedDescription.replace(/\s+/g, '_')}.png`;
        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: imageBuffer,
          ContentType: 'image/png',
        }));

        generatedImages.push(`https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`);
      } else {
        throw new Error("Failed to generate image");
      }
    }

    return NextResponse.json({ generatedImages });
  } catch (error) {
    console.error("Error generating cute photos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}