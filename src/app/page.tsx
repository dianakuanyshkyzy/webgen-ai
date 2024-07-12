'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import S3UploadForm from '@/components/S3UploadForm';
import styles from '@/styles/Home.module.css';

export default function Component() {
  const [message, setMessage] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [id, setId] = useState('');
  const [imagesUploaded, setImagesUploaded] = useState(false);

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

    } catch (error: any) {
      console.error('Error:', error);
      setGeneratedUrl(`Error: ${error.message}`);
    }
  };

  const handleUploadSuccess = (file) => {
    console.log('Uploaded file:', file);
    setImagesUploaded(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Create a Website in Just 10 Seconds!
          </h1>
          <p className="mt-3 text-base sm:mt-5 sm:text-lg md:mt-6 md:text-xl">
            Enter your message, upload an image and video, and we'll generate a website for you.
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
              Generate Website
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-base">Your website will be available at:</p>
          {generatedUrl && (
            <Link href={generatedUrl} className="text-white underline">
              {generatedUrl.startsWith('Error') ? <span className="text-red-500">{generatedUrl}</span> : generatedUrl}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium">
              Image
            </label>
            <div className="mt-1">
              <S3UploadForm onUpload={handleUploadSuccess} id={id} type="image">
                <Button className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  Select Image
                </Button>
              </S3UploadForm>
            </div>
          </div>
          <div>
            <label htmlFor="video" className="block text-sm font-medium">
              Video
            </label>
            <div className="mt-1">
              <S3UploadForm onUpload={handleUploadSuccess} id={id} type="video">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  Select Video
                </Button>
              </S3UploadForm>
            </div>
          </div>
        </div>
        {imagesUploaded && generatedUrl && (
          <div className="text-center mt-6">
            <Link href={generatedUrl} passHref>
              <Button className="w-full bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                Go to Your Personalized Website
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
