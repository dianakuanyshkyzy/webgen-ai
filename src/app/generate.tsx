// pages/generate.tsx
'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

export default function GeneratePage() {
  const [message, setMessage] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [id, setId] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('context', message);

    try {
      const response = await fetch('/api/gift-card', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        setGeneratedUrl(`Error: ${result.error}`);
        return;
      }

      const result = await response.json();
      setId(result.id);
      setGeneratedUrl(result.url);

      await generateAudio(result.id, message);

      // Redirect to the upload page with the generated ID
      router.push(`/upload?id=${result.id}`);
    } catch (error: any) {
      console.error('Error:', error);
      setGeneratedUrl(`Error: ${error.message}`);
    }
  };

  const generateAudio = async (id: string, message: string) => {
    try {
      const apiResponse = await fetch('/api/generate-songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message,
          make_instrumental: false,
          wait_audio: true,
          id,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('Error generating audio:', errorData.error);
        throw new Error(errorData.error);
      }

      const data = await apiResponse.json();
      console.log('Audio generated and uploaded to S3:', data.s3Url);
    } catch (error: any) {
      console.error('Error generating audio:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Create a Website in Just 10 Seconds!
          </h1>
          <p className="mt-3 text-base sm:mt-5 sm:text-lg md:mt-6 md:text-xl">
            Enter your message to generate the JSON file.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <div className="mt-1">
              <Textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                className="block w-full rounded-md border-0 bg-white text-black px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-600 hover:to-indigo-600 text-white py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              Generate JSON and ID
            </Button>
          </div>
        </form>
        {generatedUrl && (
          <div className="text-center mt-6">
            {generatedUrl.startsWith('Error') ? (
              <span className="text-red-500">{generatedUrl}</span>
            ) : (
              <span>{generatedUrl}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
