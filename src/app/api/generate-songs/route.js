import { NextResponse } from 'next/server';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const SUNOAI_API_URL = 'https://api2.sunoapi.software/api/generate';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(buffer, key) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'audio/mpeg',
  };
  
  try {
    await s3Client.send(new PutObjectCommand(params));
    const audioUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return audioUrl;
  } catch (err) {
    console.error('Error uploading to S3:', err);
    throw new Error('Failed to upload to S3');
  }
}

export async function POST(req) {
  const { prompt, make_instrumental, wait_audio, id } = await req.json();

  try {
    const response = await axios.post(SUNOAI_API_URL, {
      prompt,
      make_instrumental,
      wait_audio,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      console.error('Error response from Suno AI:', response.data);
      throw new Error('Failed to generate music');
    }

    const audioUrl = response.data[0].audio_url;

    // Download the audio from the generated URL
    const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const audioBuffer = Buffer.from(audioResponse.data, 'binary');

    // Upload the audio to S3
    const s3Key = `${id}/audios/${response.data[0].id}.mp3`;
    const s3Url = await uploadToS3(audioBuffer, s3Key);

    return NextResponse.json({ s3Url });
  } catch (error) {
    console.error('Error generating music:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}