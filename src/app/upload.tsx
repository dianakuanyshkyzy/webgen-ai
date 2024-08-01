// pages/upload.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import S3UploadForm from '@/components/S3UploadForm';
import { useRouter } from 'next/router';

export default function UploadPage() {
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [description, setDescription] = useState('');
  const router = useRouter();
  const { id } = router.query;

  const handleUploadSuccess = async (file: any) => {
    console.log('Uploaded file:', file);

    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error generating description:', errorData.error);
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setDescription(data.descriptions[0]);

      await generateImages(id, data.descriptions[0]);

      setImagesUploaded(true);
    } catch (error: any) {
      console.error('Error generating description and images:', error.message);
    }
  };

  const generateImages = async (id: string = '', description: string) => {
    try {
      const response = await fetch('/api/generate-cute-photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descriptions: [description], id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error generating images:', errorData.error);
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log('Images generated and uploaded to S3:', data.generatedImages);
    } catch (error: any) {
      console.error('Error generating images:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Upload Images and Videos
          </h1>
          <p className="mt-3 text-base sm:mt-5 sm:text-lg md:mt-6 md:text-xl">
            Upload images and videos to generate the website.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium">
              Image
            </label>
            <div className="mt-1">
              <S3UploadForm onUpload={handleUploadSuccess} id={id} type="image" />
            </div>
          </div>
          <div>
            <label htmlFor="video" className="block text-sm font-medium">
              Video
            </label>
            <div className="mt-1">
              <S3UploadForm onUpload={handleUploadSuccess} id={id} type="video" />
            </div>
          </div>
        </div>
        {imagesUploaded && (
          <div className="text-center mt-6">
            <Button
              className="w-full bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              onClick={() => router.push(`/generated?id=${id}`)}
            >
              Go to Your Personalized Website
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
