import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from 'next/server';
export const maxDuration = 60 
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

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: `${id}/audios/`
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return NextResponse.json({ error: "No audio found" }, { status: 404 });
    }

    const audioKeys = response.Contents.map(item => item.Key);
    const audioUrls = await Promise.all(audioKeys.map(async key => {
      const getObjectParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      };
      return await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });
    }));

    return NextResponse.json({ audio: audioUrls });
  } catch (error) {
    console.error('Error fetching audio:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}