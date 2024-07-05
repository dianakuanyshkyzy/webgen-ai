import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file, fileName) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ACL: "public-read",
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const serverRequestTime = new Date().toISOString();
    console.log("Request Time (Server Received):", serverRequestTime);

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name);

    const s3RequestTime = new Date().toISOString();
    console.log("Request Time (S3 Request):", s3RequestTime);

    console.log("File uploaded to S3:", fileName);
    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message });
  }
}
