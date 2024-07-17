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

interface AnniversaryProps {
  wishData: WishData;
  id: string;
}


const Anniversary: React.FC<AnniversaryProps> = ({ wishData, id }) => {
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
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <section className="relative h-[80dvh] w-full overflow-hidden">
          <img
            src=""
            alt="Couple Anniversary"
            className="h-full w-full object-cover object-center"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              {webData.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              {webData.recipient}, {webData.about}
            </p>
          </div>
        </section>
        <section className="py-20 px-4 md:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">Our Love Story</h2>
              <p className="mt-4 text-muted-foreground">
                {webData.paragraph}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">Cherished Moments</h2>
              <p className="mt-4 text-muted-foreground">
                {webData.short_paragraph}
              </p>
            </div>
          </div>
        </section>
        <section className="py-20 px-4 md:px-8 lg:px-16">
  <div className="mx-auto max-w-6xl">
    <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">Our Memories</h2>
    <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {images.length > 0 ? (
        images.map((image, index) => (
          <div
            key={index}
            className="rounded-lg bg-[#374151] p-6 shadow-lg transition-transform duration-500 ease-in-out hover:scale-105"
          >
            <img src={image} alt={`Memory ${index + 1}`} className="mb-4 rounded-lg" />
          </div>
        ))
      ) : (
        <div className="text-[#d1d5db]">No memories available</div>
      )}
    </div>
    <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {videos.length > 0 ? (
        videos.map((video, index) => (
          <div
            key={index}
            className="rounded-lg bg-[#374151] p-6 shadow-lg transition-transform duration-500 ease-in-out hover:scale-105"
          >
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
<section className="py-20 px-4 md:px-8 lg:px-16">
  <div className="mx-auto max-w-3xl space-y-8">
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">Heartfelt Wishes</h2>
      <div className="mt-4 space-y-4">
        {webData.wishes.map((wish, index) => (
          <div key={index} className="rounded-lg bg-muted p-4">
            <p className="text-muted-foreground">
              {wish}
            </p>
            <p className="mt-2 text-sm font-medium text-primary-foreground">- {webData.senders}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

        <section className="py-20 px-4 md:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                A Poem for Our Anniversary
              </h2>
              <p className="mt-4 text-muted-foreground">
                <span className="text-primary-foreground font-medium">My Darling,</span>
                {webData.poemabout}
                <span className="text-primary-foreground font-medium">Happy Anniversary, my love.</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  export default Anniversary; 