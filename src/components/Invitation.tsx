import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';
import Image from "next/image";

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
    eventDate: string;
    componentType: string;
    poemabout: string;
  }
}

interface InvitationProps {
  wishData: WishData;
  id: string;
}

const Invitation: React.FC<InvitationProps> = ({ wishData, id }) => {
  const { webData } = wishData;
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentWish, setCurrentWish] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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

  const playAudio = (audioEl: HTMLAudioElement) => {
    audioEl.play().then(() => {
      console.log("Audio is playing");
    }).catch((error) => {
      console.error("Auto-play was prevented:", error);
    });
  };

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const audioResponse = await fetch(`/api/s3-audios?id=${id}`);
        if (audioResponse.ok) {
          const audioData = await audioResponse.json();
          const audioEl = new Audio(audioData.audio[0]);
          audioEl.loop = true;
          setAudioElement(audioEl);
          setAudio(audioEl.src);
          playAudio(audioEl);
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
            const audioEl = new Audio(data.audio_url);
            audioEl.loop = true;
            setAudioElement(audioEl);
            setAudio(audioEl.src);
            playAudio(audioEl);
          } else {
            const errorData = await generateResponse.json();
            console.error("Error generating audio:", errorData.error);
          }
        }
      } catch (error) {
        console.error("Error fetching or generating audio:", error);
      }
    };

    fetchAudio();
  }, [id, webData.recipient]);

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

  const handleSurpriseClick = async () => {
    try {
      const audioResponse = await fetch(`/api/s3-audios?id=${id}`);

      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        const audioEl = new Audio(audioData.audio[0]);
        audioEl.loop = true;
        setAudio(audioEl.src);
        setAudioElement(audioEl);
        playAudio(audioEl);
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
          const audioEl = new Audio(data.audio_url);
          audioEl.loop = true;
          setAudio(audioEl.src);
          setAudioElement(audioEl);
          playAudio(audioEl);
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
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-background px-4 lg:px-6 py-4 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <GiftIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Invitation</span>
        </Link>
        <nav className="hidden md:flex gap-4">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Home
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Events
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join us for a Celebration</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {webData.about}
              </p>
              <div className="flex gap-4">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Date</h3>
                  <p className="text-muted-foreground">{webData.eventDate}</p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Time</h3>
                  <p className="text-muted-foreground">7:00 PM - 11:00 PM</p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Location</h3>
                  <p className="text-muted-foreground">123 Main St, Anytown USA</p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <Image
                src={imageUrls[0] || "/placeholder.svg"}
                width="550"
                height="550"
                alt="Event"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
              <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  {webData.short_paragraph}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative group">
              <Image
                src={imageUrls[1] || "/placeholder.svg"}
                width="550"
                height="550"
                alt="Sender"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
              <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  Learn more about the special person who is hosting this event and why they wanted to celebrate.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">A Message from the Host</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {webData.paragraph}
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-primary hover:underline" prefetch={false}>
                Learn More
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Celebrate with Us</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {webData.poemabout}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Image
                    src={imageUrls[2] || "/placeholder.svg"}
                    width="260"
                    height="260"
                    alt="Celebration"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <p className="text-muted-foreground text-center px-4">
                      Discover the special moments and activities we have planned for this celebration.
                    </p>
                  </div>
                </div>
                <div className="relative group">
                  <Image
                    src={imageUrls[3] || "/placeholder.svg"}
                    width="260"
                    height="260"
                    alt="Celebration"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <p className="text-muted-foreground text-center px-4">
                      Explore the interactive elements and multimedia experiences we've prepared for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <Image
                src={imageUrls[4] || "/placeholder.svg"}
                width="550"
                height="550"
                alt="Celebration"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
              <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  Get a sneak peek at the special touches and personalized details that will make this celebration truly
                  unique.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative group">
              <Image
                src={imageUrls[5] || "/placeholder.svg"}
                width="550"
                height="550"
                alt="Memories"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
              <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  Capture the special moments and memories that will be created at this event.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Cherish the Moments</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                This event is not just about the celebration, but about the memories we'll create together. Let's
                capture the laughter, the joy, and the connections that will last a lifetime.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Image
                    src={imageUrls[0] || "/placeholder.svg"}
                    width="260"
                    height="260"
                    alt="Memories"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <p className="text-muted-foreground text-center px-4">
                      Explore the photo booth and other interactive elements that will help capture the magic of this
                      event.
                    </p>
                  </div>
                </div>
               
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">A Surprise Awaits</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We've planned a special surprise that we can't wait to share with you at the event. It's going to be an
                unforgettable experience.
              </p>
              <Button
             
              className="rounded-md bg-yellow-300 px-4 py-2 text-yellow-900 hover:bg-yellow-400"
              onClick={handleSurpriseClick}
            >
              Click me!
            </Button>
            {audio && (
              <div className="mt-4">
                <audio controls autoPlay loop>
                  <source src={audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}


function GiftIcon(props: React.SVGProps<SVGSVGElement>) {
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
  );
}

export default Invitation;
