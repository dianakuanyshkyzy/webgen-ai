import Link from "next/link"
import { Button } from "@/components/ui/button"
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

interface WishData {
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
  componentType:string; 
  poemabout: string;
}

interface BoyfriendProps {
  wishData: WishData;
  id: string;
}


const Boyfriend: React.FC<BoyfriendProps> = ({ wishData, id }) => {
   const {webData} = wishData; 
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [currentWish, setCurrentWish] = useState(0);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const imageResponse = await fetch(`/api/s3-images?id=${id}`);
        const videoResponse = await fetch(`/api/s3-videos?id=${id}`);

        if (!imageResponse.ok) {
          throw new Error('Failed to fetch images');
        }
        if (!videoResponse.ok) {
          throw new Error('Failed to fetch videos');
        }

        const imageData = await imageResponse.json();
        const videoData = await videoResponse.json();

        setImages(imageData.images || []);
        setVideos(videoData.videos || []);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    if (id) {
      fetchMedia();
    }
  }, [id]);
//   console.log(images.length)
  console.log(wishData); 
   
  return (
    <div className="flex min-h-screen flex-col bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat">
      <header className="sticky top-0 z-10 bg-[#1f2937] py-4">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold text-[#f5f5f5]">Happy Birthday!</div>
          <nav className="hidden space-x-4 md:flex">
            <Link href="#wishes" className="text-[#f5f5f5] hover:text-[#d1d5db]" prefetch={false}>
              Wishes
            </Link>
            <Link href="#memories" className="text-[#f5f5f5] hover:text-[#d1d5db]" prefetch={false}>
              Memories
            </Link>
            <Link href="#facts" className="text-[#f5f5f5] hover:text-[#d1d5db]" prefetch={false}>
              Facts
            </Link>
            <Link href="#surprise" className="text-[#f5f5f5] hover:text-[#d1d5db]" prefetch={false}>
              Surprise
            </Link>
          </nav>
          <button className="block rounded-md bg-[#4b5563] px-4 py-2 text-[#f5f5f5] hover:bg-[#6b7280] md:hidden">
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </header>
      <main className="flex-1">
        <section id="wishes" className="bg-[#1f2937] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-[#f5f5f5]">Wishes for Your Birthday</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {webData.wishes.slice(0, 3).map((wish, index) => (
                <div key={index} className="rounded-lg bg-[#374151] p-6 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold text-[#f5f5f5]"></h3>
                  <p className="text-[#d1d5db]">
                    {wish}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="memories" className="bg-[#1f2937] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-[#f5f5f5]">Memories We've Shared</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {
              images.length > 0 ? images.map((image, index) => (
                <div key={index} className="rounded-lg bg-[#374151] p-6 shadow-lg">
                  <img src={image} alt={`Memory ${index + 1}`} className="mb-4 rounded-lg" />
                </div>
              )) : (
                <div className="text-[#d1d5db]">No memories available</div>
              )
              }
               {videos.length > 0 ? (
      videos.map((video, index) => (
        <div key={index} className="rounded-lg bg-[#374151] p-6 shadow-lg">
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
      <div className="text-[#d1d5db]">No memories available</div>
    )}
              
            </div>
            
          </div>
        </section>
        <section id="facts" className="bg-[#1f2937] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-[#f5f5f5]">Fun Facts About You</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {webData?.facts.map((fact, index) => (
                <div key={index} className="rounded-lg bg-[#374151] p-6 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold text-[#f5f5f5]">{webData.recipient} ...</h3>
                  <p className="text-[#d1d5db]">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="surprise" className="bg-[#1f2937] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-[#f5f5f5]">A Special Surprise</h2>
            <div className="rounded-lg bg-[#374151] p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-[#f5f5f5]">A Romantic Getaway</h3>
              <p className="mb-4 text-[#d1d5db]">
                As a special birthday surprise, I've planned a romantic weekend getaway for us. We'll be staying at a
                cozy cabin in the mountains, where we can enjoy the peaceful surroundings, go on hikes, and simply spend
                quality time together.
              </p>
              <Button href="#" className="rounded-md bg-[#4b5563] px-4 py-2 text-[#f5f5f5] hover:bg-[#6b7280]">
                Discover More
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#1f2937] py-6">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-[#d1d5db]">&copy; 2024 Your Boyfriend's Birthday. All rights reserved.</p>
          <nav className="hidden space-x-4 md:flex">
            <Link href="#wishes" className="text-[#d1d5db] hover:text-[#f5f5f5]" prefetch={false}>
              Wishes
            </Link>
            <Link href="#memories" className="text-[#d1d5db] hover:text-[#f5f5f5]" prefetch={false}>
              Memories
            </Link>
            <Link href="#facts" className="text-[#d1d5db] hover:text-[#f5f5f5]" prefetch={false}>
              Facts
            </Link>
            <Link href="#surprise" className="text-[#d1d5db] hover:text-[#f5f5f5]" prefetch={false}>
              Surprise
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function MenuIcon(props) {
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
  )
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
  )
}

export default Boyfriend;