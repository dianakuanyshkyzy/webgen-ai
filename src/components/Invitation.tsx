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
  poemabout: string
}

interface InvitationProps {
  wishData: WishData;
  id: string;
}

const Invitation: React.FC<InvitationProps> = ({ wishData, id }) => {
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
        <Button size="sm">RSVP</Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join us for a Celebration</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                You're invited to a special event where we'll come together to celebrate life, love, and the moments
                that matter most.
              </p>
              <div className="flex gap-4">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Date</h3>
                  <p className="text-muted-foreground">June 10, 2023</p>
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
              <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Event"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
              <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  Join us for a night of celebration, laughter, and making memories that will last a lifetime.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative group">
              <img
                src="/placeholder.svg"
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
                I'm thrilled to invite you to this special celebration. This event holds a dear place in my heart, and I
                can't wait to share it with you. Let's come together and create memories that will last a lifetime.
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
                This event is a chance for us to come together and celebrate the moments that matter most. Whether it's
                a birthday, wedding, or any other special occasion, we're excited to share this experience with you.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <img
                    src="/placeholder.svg"
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
                  <img
                    src="/placeholder.svg"
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
              <img
                src="/placeholder.svg"
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
              <img
                src="/placeholder.svg"
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
                  <img
                    src="/placeholder.svg"
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
                <div className="relative group">
                  <img
                    src="/placeholder.svg"
                    width="260"
                    height="260"
                    alt="Memories"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <p className="text-muted-foreground text-center px-4">
                      Discover the special ways we'll be sharing and preserving the memories from this celebration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                RSVP and Join the Celebration
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We can't wait to have you join us for this special event. Please RSVP to let us know you'll be there,
                and feel free to reach out if you have any questions or special requests.
              </p>
              <div className="flex gap-4">
                <Button>RSVP Now</Button>
                <Button variant="outline">Contact Us</Button>
              </div>
            </div>
            <div className="relative group">
              <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="RSVP"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
              <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  Don't miss out on this special celebration. RSVP now to secure your spot and be a part of the magic.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative group">
              <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Surprise"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
              <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  Get ready for a special surprise that will make this celebration even more memorable.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">A Surprise Awaits</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We've planned a special surprise that we can't wait to share with you at the event. It's going to be an
                unforgettable experience, so make sure to RSVP and join us.
              </p>
              <Button>Open for Surprise</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted p-6 md:py-12 w-full">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Event Details</h3>
            <Link href="#" prefetch={false}>
              Date
            </Link>
            <Link href="#" prefetch={false}>
              Time
            </Link>
            <Link href="#" prefetch={false}>
              Location
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">About</h3>
            <Link href="#" prefetch={false}>
              The Host
            </Link>
            <Link href="#" prefetch={false}>
              Our Story
            </Link>
            <Link href="#" prefetch={false}>
              Contact
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Celebration</h3>
            <Link href="#" prefetch={false}>
              Activities
            </Link>
            <Link href="#" prefetch={false}>
              Memories
            </Link>
            <Link href="#" prefetch={false}>
              Surprises
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">RSVP</h3>
            <Link href="#" prefetch={false}>
              RSVP Now
            </Link>
            <Link href="#" prefetch={false}>
              Special Requests
            </Link>
            <Link href="#" prefetch={false}>
              FAQ
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Follow Us</h3>
            <Link href="#" prefetch={false}>
              Instagram
            </Link>
            <Link href="#" prefetch={false}>
              Facebook
            </Link>
            <Link href="#" prefetch={false}>
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ArrowRightIcon(props) {
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

export default Invitation; 