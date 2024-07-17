import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QuoteIcon, CakeIcon, FlowerIcon, PaletteIcon, PawPrintIcon } from "lucide-react";
import confetti from "canvas-confetti";
import { useSpring, animated } from '@react-spring/web';
import React, { useState, useEffect } from 'react';


function AnimatedImage({ src, index, total }) {
        const angle = (index / total) * 2 * Math.PI;
        const radius = 150; // Adjust the radius as needed
      
        const styles = useSpring({
          from: { transform: `rotate(${angle}rad) translate(${radius}px) rotate(${-angle}rad)` },
          to: async (next) => {
            while (1) {
              await next({ transform: `rotate(${angle + 360}deg) translate(${radius}px) rotate(${-angle - 360}rad)` });
            }
          },
          config: { duration: 240000 },
          reset: true,
        });
  
    return (
      <animated.img
        src={src}
        className="absolute top-1/2 left-1/2 w-24 h-24 object-cover rounded-lg"
        style={{
          transform: `translate(-50%, -50%) rotate(${angle}rad) translate(${radius}px) rotate(${-angle}rad)`,
          ...styles,
        }}
      />
    );
  }
  

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

interface ChildProps {
  wishData: WishData;
  id: string;
}


const Child: React.FC<ChildProps> = ({ wishData, id }) => {
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
   
    const throwConfetti = () => {
      confetti({
        particleCount: 400,
        spread: 200,
        origin: { y: 0.6 },
      });
    };
  return (
    <div className="flex flex-col min-h-dvh bg-[#f0f8ff] text-foreground">
      <header className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center justify-center space-y-6">
          <div 
              className="rounded-full bg-pink-300 p-8 text-9xl text-pink-700 animate-bounce cursor-pointer"
              onClick={throwConfetti}
            >
              🎉
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Happy Birthday, Emma!
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src={images[0]} width={400} height={400} alt="Birthday Cake" className="max-w-full" />
          </div>
        </div>
      </header>
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Memories Over the Years</h2>
            
             <div className="relative h-96 w-full">
              {images.map((src, index) => (
                <AnimatedImage key={index} src={src} index={index} total={images.length} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">A Message for You</h2>
            <p className="max-w-md text-center text-muted-foreground">
              Emma, my dear little sister, I can't believe you're already 6 years old! Time has flown by so quickly,
              but the memories we've created together will last a lifetime. You've grown into such an amazing, kind, and
              intelligent young girl, and I'm so proud of you. I hope your birthday is filled with joy, laughter, and
              all the things that make you happy. I love you more than words can express, and I can't wait to see what
              the future holds for you. Happy birthday, sis!
            </p>
          </div>

          <Card className="w-full bg-pink-100">
            <CardHeader>
              <CardTitle>Emma's Birthday Quotes</CardTitle>
              <CardDescription>Inspiring and heartfelt quotes to celebrate Emma's special day.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <blockquote className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <QuoteIcon className="h-5 w-5 text-primary" />
                  <span>Emma, may your birthday be as bright and beautiful as you are.</span>
                </div>
                <div className="text-sm text-muted-foreground">- Your Loving Family</div>
              </blockquote>
              <blockquote className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <QuoteIcon className="h-5 w-5 text-primary" />
                  <span>Wishing you a day as special as you are, Emma. Happy birthday!</span>
                </div>
                <div className="text-sm text-muted-foreground">- Your Best Friends</div>
              </blockquote>
              <blockquote className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <QuoteIcon className="h-5 w-5 text-primary" />
                  <span>Emma, may your birthday be filled with laughter, love, and all your heart's desires.</span>
                </div>
                <div className="text-sm text-muted-foreground">- Your Adoring Grandparents</div>
              </blockquote>
            </CardContent>
          </Card>

          <Card className="w-full bg-blue-100 text-blue-900">
            <CardHeader>
              <CardTitle>Fun Facts About Emma</CardTitle>
              <CardDescription>Get to know your little sister a little better!</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-blue-100">
                  <CakeIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-medium">Favorite Dessert</div>
                  <div className="text-sm text-blue-900/80">Chocolate Cake</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-blue-100">
                  <FlowerIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-medium">Favorite Flower</div>
                  <div className="text-sm text-blue-900/80">Sunflowers</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-blue-100">
                  <PaletteIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-medium">Favorite Color</div>
                  <div className="text-sm text-blue-900/80">Purple</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-blue-100">
                  <PawPrintIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-medium">Favorite Animal</div>
                  <div className="text-sm text-blue-900/80">Puppies</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="surprise" className="py-16 bg-yellow-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-yellow-900">A Special Surprise</h2>
          <div className="rounded-lg bg-yellow-200 p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-yellow-900">An Adventure Day</h3>
            <p className="mb-4 text-yellow-800">
              As a special birthday surprise, I've planned an exciting adventure day for us! We'll start with a visit to your favorite amusement park, followed by a picnic in the park. In the afternoon, we'll go to a fun art class where we can create beautiful paintings together. It's going to be a day full of laughter and joy!
            </p>
            <Button href="#" className="rounded-md bg-yellow-300 px-4 py-2 text-yellow-900 hover:bg-yellow-400">
              Discover More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Child; 