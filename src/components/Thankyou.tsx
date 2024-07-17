
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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

interface ThankyouProps {
  wishData: WishData;
  id: string;
}


const ThankYou: React.FC<ThankyouProps> = ({ wishData, id }) => {
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

  console.log(wishData); 
  const handleNextWish = () => {
    setCurrentWish((prev) => (prev + 1) % webData?.wishes.length);
  };

  const handlePrevWish = () => {
    setCurrentWish((prev) => (prev - 1 + webData?.wishes.length) % webData.wishes.length);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextWish();
    }, 5000);
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [webData.wishes.length]);
  if (!webData) {
    return <div>Loading...</div>; // Adjust this to your preferred loading state
  }
  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="#" prefetch={false}>
            <GiftIcon className="h-6 w-6" />
            <span className="sr-only">Thank You Notes</span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
              Features
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
              Testimonials
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
              FAQ
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
              Contact
            </Link>
          </nav>
          <Button>Get Started</Button>
        </div>
      </header>
      <main>
        <section className="bg-gradient-to-r from-primary to-primary-foreground py-24 text-center text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Personalized Thank You Notes</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl">
              Express your gratitude in a unique and thoughtful way with our personalized thank you note service.
            </p>
            <div className="mt-8">
              <Button variant="secondary">Get Started</Button>
            </div>
          </div>
        </section>
        <section id="features" className="py-24">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 md:px-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  alt="Feature 1"
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-500 hover:opacity-100">
                  <PlayIcon className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold">Personalized Designs</h3>
              <p className="mt-2 text-muted-foreground">
                Choose from a variety of unique and elegant designs to make your thank you note truly special.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  alt="Feature 2"
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-500 hover:opacity-100">
                  <PlayIcon className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold">Handwritten Touches</h3>
              <p className="mt-2 text-muted-foreground">
                Our team of skilled calligraphers will add a personal touch to your note, making it feel truly
                heartfelt.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  alt="Feature 3"
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-500 hover:opacity-100">
                  <PlayIcon className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold">Sustainable Materials</h3>
              <p className="mt-2 text-muted-foreground">
                Our thank you notes are made with eco-friendly materials, ensuring your gratitude is expressed in a
                sustainable way.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  alt="Feature 4"
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-500 hover:opacity-100">
                  <PlayIcon className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold">Timely Delivery</h3>
              <p className="mt-2 text-muted-foreground">
                We understand the importance of timely gratitude, so we offer fast and reliable delivery to ensure your
                thank you note arrives on time.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  alt="Feature 5"
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-500 hover:opacity-100">
                  <PlayIcon className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold">Personalized Messages</h3>
              <p className="mt-2 text-muted-foreground">
                Craft a heartfelt message that truly captures your appreciation and sentiment, making your thank you
                note even more meaningful.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  alt="Feature 6"
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-500 hover:opacity-100">
                  <PlayIcon className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold">Thoughtful Packaging</h3>
              <p className="mt-2 text-muted-foreground">
                Your thank you note will be carefully packaged and presented in a way that adds to the overall
                experience and makes it a true gift.
              </p>
            </div>
          </div>
        </section>
        <section id="testimonials" className="bg-muted py-24">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 md:px-6">
            <div className="flex flex-col items-center justify-center">
              <blockquote className="relative rounded-lg bg-background p-8 shadow-lg">
                <div className="absolute top-0 left-0 -translate-x-4 -translate-y-4">
                  <QuoteIcon className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  "The personalized thank you note I received from Thank You\n Notes was absolutely stunning. The
                  attention to detail and\n thoughtful touches made it a truly special gift."
                </p>
                <div className="mt-4 flex items-center">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-medium">John Doe</div>
                    <div className="text-muted-foreground">CEO, Acme Inc.</div>
                  </div>
                </div>
              </blockquote>
            </div>
            <div className="flex flex-col items-center justify-center">
              <blockquote className="relative rounded-lg bg-background p-8 shadow-lg">
                <div className="absolute top-0 left-0 -translate-x-4 -translate-y-4">
                  <QuoteIcon className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  "I was blown away by the quality and thoughtfulness of the\n thank you note I received from Thank You
                  Notes. It's the\n perfect way to express my gratitude in a truly memorable way."
                </p>
                <div className="mt-4 flex items-center">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-medium">Jane Doe</div>
                    <div className="text-muted-foreground">Marketing Manager, Acme Inc.</div>
                  </div>
                </div>
              </blockquote>
            </div>
          </div>
        </section>
       
      </main>
    </div>

  )
}

function CheckIcon(props) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}


function GiftIcon(props) {
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
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  )
}


function PlayIcon(props) {
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
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}


function QuoteIcon(props) {
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
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
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

export default ThankYou;