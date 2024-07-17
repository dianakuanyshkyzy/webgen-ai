
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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

interface GraduationProps {
  wishData: WishData;
  id: string;
}
const Graduation: React.FC<GraduationProps> = ({ wishData, id }) => {
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
      <header className="bg-gradient-to-r from-[#00b0ff] to-[#00e5ff] py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Congratulations!</h1>
          <p className="mt-4 text-lg md:text-xl">
            We are so proud of your incredible achievement. Your hard work and dedication have paid off, and we can't
            wait to see what the future holds for you.
          </p>
          <div className="mt-8">
            <img
              src="/placeholder.svg"
              width={800}
              height={500}
              alt="Graduate"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </header>
      <main>
        <section className="bg-white py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src="/placeholder.svg"
                width={400}
                height={500}
                alt="Graduate Portrait"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">About the Graduate</h2>
              <p className="mt-4 text-lg text-gray-600">
                [Graduate Name] has always been a driven and passionate individual, dedicated to their studies and
                personal growth. Throughout their academic journey, they have consistently demonstrated a strong work
                ethic, a thirst for knowledge, and a commitment to excellence. Their accomplishments are a testament to
                their unwavering determination and the support of their loved ones.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                As they embark on the next chapter of their life, we are confident that [Graduate Name] will continue to
                excel and make a positive impact on the world around them. Their future is bright, and we can't wait to
                see what they will achieve.
              </p>
            </div>
          </div>
        </section>
        <section className="bg-gray-100 py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tight text-center">Gallery</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg"
                  width={400}
                  height={300}
                  alt="Graduate Photo 1"
                  className="w-full h-full object-cover"
                />
                <div className="bg-white p-2 text-center text-sm text-gray-600">Celebrating the big day!</div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg"
                  width={400}
                  height={300}
                  alt="Graduate Photo 2"
                  className="w-full h-full object-cover"
                />
                <div className="bg-white p-2 text-center text-sm text-gray-600">Proud moment with family</div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg"
                  width={400}
                  height={300}
                  alt="Graduate Photo 3"
                  className="w-full h-full object-cover"
                />
                <div className="bg-white p-2 text-center text-sm text-gray-600">Celebrating with friends</div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg"
                  width={400}
                  height={300}
                  alt="Graduate Photo 4"
                  className="w-full h-full object-cover"
                />
                <div className="bg-white p-2 text-center text-sm text-gray-600">Proud moment with loved ones</div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg"
                  width={400}
                  height={300}
                  alt="Graduate Photo 5"
                  className="w-full h-full object-cover"
                />
                <div className="bg-white p-2 text-center text-sm text-gray-600">Capturing the memories</div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg"
                  width={400}
                  height={300}
                  alt="Graduate Photo 6"
                  className="w-full h-full object-cover"
                />
                <div className="bg-white p-2 text-center text-sm text-gray-600">Celebrating the achievement</div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tight text-center">Messages for the Graduate</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-600">Friend</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  Congratulations on your incredible achievement! You have worked so hard, and it's inspiring to see you
                  reach this milestone. Wishing you all the best in your future endeavors.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Sarah Miller</p>
                    <p className="text-sm text-gray-600">Family</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  We are so proud of you and all that you have accomplished. Your dedication and hard work have paid
                  off, and we can't wait to see what the future holds for you. Congratulations!
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>EM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Emily Martinez</p>
                    <p className="text-sm text-gray-600">Classmate</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  Congratulations on your graduation! You have been an inspiration to all of us, and I'm so glad to have
                  been a part of your journey. Wishing you all the best in your future endeavors.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[#00b0ff] py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight">Celebrate the Graduate</h2>
            <p className="mt-4 text-lg">
              Share this website with your friends and family to celebrate [Graduate Name]'s incredible achievement.
            </p>
            <div className="mt-8">
              <Button className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-[#00b0ff] font-medium shadow-sm transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                Share Website
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 py-6 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl text-center text-gray-400">
          <p>&copy; 2024 Graduation Celebration. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Graduation; 