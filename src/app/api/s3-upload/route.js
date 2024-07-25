
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file, fileName, id, type) {
  const fileBuffer = file;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${id}/${type}s/${fileName}`,
    Body: fileBuffer,
    ContentType: type === 'image' ? "image/jpg" : "video/mp4",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const id = request.nextUrl.searchParams.get('id');
    const type = request.nextUrl.searchParams.get('type');

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: "Type is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name, id, type);

    return NextResponse.json({ success: true, fileName, id });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}