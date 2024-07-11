

'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import styles from '@/styles/Home.module.css';
import React from 'react';
import S3UploadForm from '@/components/S3UploadForm';
import DadHomePage from '@/components/DadHomePage';
export default function Component() {
  const [message, setMessage] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [id, setId] = useState('');

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-md w-full space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Website generator</h1>
          <p className="text-muted-foreground">
            Enter the text for your personalized website.
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message"
                className="w-full"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <Card className="w-full max-w-xs bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <CardContent className="text-center space-y-4">
                  <div className="text-4xl font-bold">Generate a website!</div>
                  <div id="generated-text" className="text-lg" />
                </CardContent>
              </Card>
            </div>
            <Button className="w-full" type="submit">
              Generate Gift Card
            </Button>
          </form>
          
            <>
              <div className="grid w-full max-w-sm items-center gap-1.5 my-5">
                <Label htmlFor="pictures">Pictures</Label>
                <S3UploadForm onUpload={(file) => console.log('Uploaded file:', file)} id={id} type="image" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5 my-5">
                <Label htmlFor="videos">Videos</Label>
                <S3UploadForm onUpload={(file) => console.log('Uploaded file:', file)} id={id} type="video" />
              </div>
            </>
          
          {generatedUrl && (
            <div className="mt-4 text-center text-lg">
              {generatedUrl.startsWith('Error') ? (
                <span className="text-red-500">{generatedUrl}</span>
              ) : (
                <span>
                  Your webpage is generated at:{' '}
                  <a href={generatedUrl} className="text-blue-500 underline">
                    {generatedUrl}
                  </a>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
