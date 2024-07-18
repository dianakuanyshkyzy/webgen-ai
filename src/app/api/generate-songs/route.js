import { NextResponse } from 'next/server';
import axios from 'axios';

const SUNOAI_API_URL = 'https://api5.sunoapi.software/api/generate';

export async function POST(req) {
  const { prompt, make_instrumental, wait_audio } = await req.json();

  try {
    const response = await axios.post(SUNOAI_API_URL, {
      prompt,
      make_instrumental,
      wait_audio,
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.status !== 200) {
      console.error('Error response from Suno AI:', response.data);
      throw new Error('Failed to generate music');
    }
    console.log('Generated music:', response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error generating music:', error.message, error.response?.data);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
