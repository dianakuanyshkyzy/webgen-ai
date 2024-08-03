'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="flex flex-col items-center">
      <svg
        className="animate-spin h-12 w-12 text-white mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8h4z"
        />
      </svg>
      <p className="text-white text-lg">{message}</p>
    </div>
  </div>
);

export default function Component() {
  const [message, setMessage] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [id, setId] = useState('');
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [description, setDescription] = useState('');
  const [step, setStep] = useState(1); // Step state to manage the different steps
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingMessage('Generating your website...');
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
        setLoadingMessage(null);
        return;
      }

      const result = await response.json();
      setId(result.id);
      setGeneratedUrl(result.url);
      setStep(2); // Move to the next step

      generateAudio(result.id, message); // Generate audio in the background
    } catch (error: any) {
      console.error('Error:', error);
      setGeneratedUrl(`Error: ${error.message}`);
    } finally {
      setLoadingMessage(null);
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

  const handleUploadSuccess = async (file: File) => {
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

  const generateImages = async (id: string, description: string) => {
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const uploadFiles = async () => {
    setUploading(true);
    setLoadingMessage('Uploading files...');

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/s3-upload?id=${id}&type=${file.type.startsWith('image') ? 'image' : 'video'}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Upload failed:', errorData);
          continue;
        }

        const data = await response.json();
        console.log('Upload response data:', data);
        await handleUploadSuccess(file); // Call the handleUploadSuccess function with the file
      }
    } catch (error) {
      console.log('Error uploading file:', error);
    } finally {
      setUploading(false);
      setLoadingMessage(null);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-400 text-white">
      {loadingMessage && <LoadingOverlay message={loadingMessage} />}
      <video autoPlay muted loop className="absolute w-full h-full object-cover z-0">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-white opacity-30 z-0"></div>
      <div className="relative z-10 max-w-md w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8 text-center">
        {step === 1 && (
          <>
            <div>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
                Create a Website in a Minute
              </h1>
              <p className="mt-4 text-lg sm:text-xl md:text-2xl">
                Enter your message, and we'll generate a website for you.
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
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  Generate Website
                </Button>
              </div>
            </form>
          </>
        )}
        
        {step === 2 && (
          <>
            <div>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
                Upload Images and Videos
              </h1>
              <p className="mt-4 text-lg sm:text-xl md:text-2xl">
                Drag-and-drop your files below.
              </p>
            </div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center w-full h-64 p-8 border-2 border-dashed border-primary rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <CloudUploadIcon className="w-12 h-12 text-primary" />
              <h3 className="mt-4 text-lg font-medium text-primary">Drag and drop files here</h3>
              <p className="mt-2 text-sm text-muted-foreground">or click to select files</p>
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileSelect}
              />
            </div>
            {files.length > 0 && (
              <>
                <div className="w-full overflow-hidden rounded-lg shadow-lg mt-4">
                  <table className="w-full table-auto">
                    <thead className="bg-primary text-primary-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">File</th>
                        <th className="px-4 py-3 text-right">Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file, index) => (
                        <tr key={index} className="border-b border-muted/20 last:border-b-0 hover:bg-muted/10">
                          <td className="px-4 py-3 text-left">{file.name}</td>
                          <td className="px-4 py-3 text-right">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button onClick={uploadFiles} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 mt-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  {uploading ? "Uploading..." : "Upload Files"}
                </Button>
              </>
            )}
            {imagesUploaded && (
              <div className="text-center mt-6">
                <Link href={generatedUrl} passHref>
                  <Button className="w-full bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    Go to Your Personalized Website
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}
