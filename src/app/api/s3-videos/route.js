import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from 'next/server';

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
      console.error("ID is required.");
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: `${id}/videos/`
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      console.error(`No videos found for ID: ${id}`);
      return NextResponse.json({ error: "No videos found" }, { status: 404 });
    }

    const videoKeys = response.Contents.map(item => item.Key);
    const videoUrls = await Promise.all(videoKeys.map(async key => {
      const getObjectParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      };
      return await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });
    }));

    return NextResponse.json({ videos: videoUrls });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
