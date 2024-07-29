'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import S3UploadForm from '@/components/S3UploadForm';

export default function Component() {
  const [message, setMessage] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [id, setId] = useState('');
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [description, setDescription] = useState('');

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

      // Generate audio after generating the website






      //await generateAudio(result.id, message);








    } catch (error: any) {
      console.error('Error:', error);
      setGeneratedUrl(`Error: ${error.message}`);
    }
  };

  const generateAudio = async (id, message) => {
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
    } catch (error) {
      console.error('Error generating audio:', error.message);
    }
  };

  const handleUploadSuccess = async (file) => {
    console.log('Uploaded file:', file);

    try {
      // Generate description
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

      // Generate images based on description
      await generateImages(id, data.descriptions[0]);

      setImagesUploaded(true);
    } catch (error) {
      console.error('Error generating description and images:', error.message);
    }
  };

  const generateImages = async (id, description) => {
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
    } catch (error) {
      console.error('Error generating images:', error.message);
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






// /**
//  * v0 by Vercel.
//  * @see https://v0.dev/t/B1sBwvjQh84
//  * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
//  */
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

// export default function Component() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Upload Images</CardTitle>
//         <CardDescription>Drag and drop your images or click the button below to select files.</CardDescription>
//       </CardHeader>
//       <CardContent className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-10 space-y-6">
//         <CloudUploadIcon className="w-16 h-16 text-zinc-500 dark:text-zinc-400" />
//         <Button variant="outline">Select Files</Button>
//       </CardContent>
//     </Card>
//   )
// }

// function CloudUploadIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
//       <path d="M12 12v9" />
//       <path d="m16 16-4-4-4 4" />
//     </svg>
//   )
// }


// function XIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   )
// }