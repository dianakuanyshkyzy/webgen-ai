import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import './Boyfriend.css';

interface WishData {
  webData: {
    title: string;
    recipient: string;
    about: string;
    images: string[];
    quotes: string[];
    videos: string[];
    wishes: string[];
    hobbies: string[];
    paragraph: string;
    characteristics: string[];
    short_paragraph: string;
    senders: string;
    gender: string;
    componentType: string;
    poemabout: string;
  }
}

interface BoyfriendProps {
  wishData: WishData;
  id: string;
}

const Boyfriend: React.FC<BoyfriendProps> = ({ wishData, id }) => {
  const { webData } = wishData;
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const songUrl = searchParams.get('songUrl');

  useEffect(() => {
    const fetchAudio = async () => {
      if (songUrl) {
        const audioElement = new Audio(songUrl);
        audioElement.loop = true;
        audioElement.play().catch(() => {
          console.log('Auto-play was prevented. Click the button to play the audio.');
        });
        setAudio(songUrl);
        
      } else {
        try {
          const audioResponse = await fetch(`/api/s3-audios?id=${id}`);
          if (audioResponse.ok) {
            const audioData = await audioResponse.json();
            const audioElement = new Audio(audioData.audio[0]);
            audioElement.loop = true;
            audioElement.play().catch(() => {
              console.log('Auto-play was prevented. Click the button to play the audio.');
            });
            setAudio(audioElement.src);
          } else {
            const generateResponse = await fetch("/api/generate-songs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt: webData.recipient,
                make_instrumental: false,
                wait_audio: true,
              }),
            });

            if (generateResponse.ok) {
              const data = await generateResponse.json();
              const audioElement = new Audio(data.audio_url);
              audioElement.loop = true;
              audioElement.play().catch(() => {
                console.log('Auto-play was prevented. Click the button to play the audio.');
              });
              setAudio(audioElement.src);
            } else {
              const errorData = await generateResponse.json();
              console.error("Error generating audio:", errorData.error);
            }
          }
        } catch (error) {
          console.error("Error fetching or generating audio:", error);
        }
      }
    };

    fetchAudio();
  }, [id, songUrl, webData.recipient]);

  useEffect(() => {
    const fetchGeneratedImages = async () => {
      try {
        const response = await fetch(`/api/s3-generated-photos?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch generated images');
        }
        const data = await response.json();
        setImageUrls(data.imageUrls);
      } catch (error) {
        console.error('Error fetching generated images:', error);
      }
    };

    fetchGeneratedImages();
  }, [id]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageResponse = await fetch(`/api/s3-images?id=${id}`);
        if (!imageResponse.ok) {
          throw new Error("Failed to fetch images");
        }
        const imageData = await imageResponse.json();
        setImages(imageData.images || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const fetchVideos = async () => {
      try {
        const videoResponse = await fetch(`/api/s3-videos?id=${id}`);
        if (!videoResponse.ok) {
          throw new Error("Failed to fetch videos");
        }
        const videoData = await videoResponse.json();
        setVideos(videoData.videos || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    if (id) {
      fetchImages();
      fetchVideos();
    }
  }, [id]);

  const handleSurpriseClick = async () => {
    try {
      const audioResponse = await fetch(`/api/s3-audios?id=${id}`);

      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        const audioElement = new Audio(audioData.audio[0]);
        audioElement.loop = true;
        setAudio(audioElement.src);
        audioElement.play();
      } else {
        const generateResponse = await fetch("/api/generate-songs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: webData.recipient,
            make_instrumental: false,
            wait_audio: true,
          }),
        });

        if (generateResponse.ok) {
          const data = await generateResponse.json();
          const audioElement = new Audio(data.audio_url);
          audioElement.loop = true;
          setAudio(audioElement.src);
          audioElement.play();
        } else {
          const errorData = await generateResponse.json();
          console.error("Error generating audio:", errorData.error);
        }
      }
    } catch (error) {
      console.error("Error fetching or generating audio:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f4f8]">
      <header className="sticky top-0 z-10 bg-[#ffcccb] py-4">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold text-[#333]">Happy Birthday!</div>
          <nav className="hidden space-x-4 md:flex">
            <Link href="#wishes" className="text-[#333] hover:text-[#555]" prefetch={false}>
              Wishes
            </Link>
            <Link href="#memories" className="text-[#333] hover:text-[#555]" prefetch={false}>
              Memories
            </Link>
            <Link href="#facts" className="text-[#333] hover:text-[#555]" prefetch={false}>
              Facts
            </Link>
            <Link href="#surprise" className="text-[#333] hover:text-[#555]" prefetch={false}>
              Surprise
            </Link>
          </nav>
          <button className="block rounded-md bg-[#ffcccb] px-4 py-2 text-[#333] hover:bg-[#ff9999] md:hidden">
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </header>
      <main className="flex-1">
        <section id="wishes" className="bg-[#ffcccb] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-[#333]">Wishes for Your Birthday</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {webData.wishes.slice(0, 3).map((wish, index) => (
                <div key={index} className="rounded-lg bg-[#ffe5e5] p-6 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold text-[#333]"></h3>
                  <p className="text-[#555]">
                    {wish}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="memories" className="bg-[#ffcccb] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-[#333]">Memories We&apos;ve Shared</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {imageUrls.length > 0 ? imageUrls.map((image, index) => (
                <div key={index} className="rounded-lg bg-[#ffe5e5] p-6 shadow-lg">
                  <Image src={image} alt={`Memory ${index + 1}`} className="mb-4 rounded-lg" width={500} height={500} />
                </div>
              )) : (
                <div className="text-[#555]"></div>
              )}
              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <div key={index} className="rounded-lg bg-[#ffe5e5] p-6 shadow-lg">
                    <video
                      src={video}
                      controls
                      className="mb-4 rounded-lg"
                      width="100%"
                      height="auto"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))
              ) : (
                <div className="text-[#555]"></div>
              )}
            </div>
          </div>
        </section>
        <section id="facts" className="bg-[#ffcccb] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-[#333]">Fun Facts About You</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {webData?.hobbies.map((fact, index) => (
                <div key={index} className="rounded-lg bg-[#ffe5e5] p-6 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold text-[#333]">{webData.recipient} ...</h3>
                  <p className="text-[#555]">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="surprise" className="bg-[#ffcccb] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-[#333]">A Special Surprise</h2>
            <div className="rounded-lg bg-[#ffe5e5] p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-[#333]">A Romantic Getaway</h3>
              <p className="mb-4 text-[#555]">
                As a special birthday surprise, click this button to listen to a song written just for you.
              </p>
              <Button
                className="rounded-md bg-[#ff9999] px-4 py-2 text-[#333] hover:bg-[#ff6666]"
                onClick={handleSurpriseClick}
              >
                Click me!
              </Button>
              {audio && (
                <div className="mt-4">
                  <audio controls>
                    <source src={audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#ffcccb] py-6">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-[#555]">&copy; 2024 All rights reserved.</p>
          <nav className="hidden space-x-4 md:flex">
            <Link href="#wishes" className="text-[#555] hover:text-[#333]" prefetch={false}>
              Wishes
            </Link>
            <Link href="#memories" className="text-[#555] hover:text-[#333]" prefetch={false}>
              Memories
            </Link>
            <Link href="#facts" className="text-[#555] hover:text-[#333]" prefetch={false}>
              Facts
            </Link>
            <Link href="#surprise" className="text-[#555] hover:text-[#333]" prefetch={false}>
              Surprise
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export default Boyfriend;
