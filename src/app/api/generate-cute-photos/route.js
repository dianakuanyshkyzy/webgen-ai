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
  const sanitizedDescription = description.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  return `${sanitizedDescription}. Create an image in a cartoon style.`;
};

export async function POST(req) {
  try {
    const scenarios = [
      "holding a bouquet of vibrant flowers, standing in a garden filled with colorful blooms. The person is standing at a distance from the camera, with the garden scene spread out in the background",
      "playing with a cute puppy in a sunny backyard, looking at this puppy. The person is sitting sideways on the grass, with the puppy wagging its tail and looking up at the person with big, adorable eyes. The scene is captured from a distance, showing the entire backyard",
      "sitting under a tree, reading an interesting book with a serene expression. The person is seated at a distance from the camera, with the tree and surrounding park area visible in the background",
      "exploring a magical forest, looking up at the tall trees with wonder. The person is at some distance from the camera, surrounded by the mystical forest setting",
      "riding a bicycle down a tree-lined street, smiling with joy. The scene is viewed from a distance, capturing the entire street and the person on the bicycle",
      "playing in the snow, building a snowman with a carrot nose and coal eyes. The person is at a distance from the camera, showing the snowman and the snowy landscape around them",
      "sitting on a park bench, enjoying a delicious ice cream cone on a sunny day. The person is at some distance from the camera, with the park setting clearly visible in the background"
    ];
    
    const { descriptions, id } = await req.json();
    
    const generatedImages = [];
    for(const scenario of scenarios){
    for (const description of descriptions) {
      const descriptionfull = `The character is ${scenario}. ${description}`;
      const sanitizedDescription = sanitizeDescription(descriptionfull);
      console.log(`Generating image for description: ${sanitizedDescription}`);

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: sanitizedDescription,
        n: 1,
        size: '1024x1024',
      });

      if (response.data && response.data[0] && response.data[0].url) {
        const imageUrl = response.data[0].url;
        console.log(`Image URL: ${imageUrl}`);
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
    } }

    console.log('Generated images:', generatedImages);
    return NextResponse.json({ generatedImages });
  } catch (error) {
    console.error("Error generating cute photos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}