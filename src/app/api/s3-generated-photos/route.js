import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: `${id}/generated-images/`,
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    const imageUrls = response.Contents.map(item => 
      `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`
    );

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("Error fetching generated images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
