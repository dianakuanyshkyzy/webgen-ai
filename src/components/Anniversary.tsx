import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Countdown from './ui/countdown';
interface WishData {
  title: string;
  recipient: string;
  eventDate: string;
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

interface AnniversaryProps {
  wishData: WishData;
  id: string;
}

const Anniversary: React.FC<AnniversaryProps> = ({ wishData, id }) => {
  const { webData } = wishData; 
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
      <div className="flex flex-col">
        <div className="flex flex-col items-center px-5 pb-9 w-full bg-zinc-50 max-md:max-w-full">
          <div className="flex gap-5 justify-between self-stretch px-10 py-3 w-full border-b border-gray-200 border-solid text-neutral-900 max-md:flex-wrap max-md:px-5 max-md:max-w-full">
            <div className="flex gap-4 my-auto text-lg font-bold leading-6 whitespace-nowrap">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7a83d6011abf080bfa320b03f7f4be5821d3903a4c089d32e4b7a09fd83acb3a?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="flex-1 shrink-0 my-auto w-full aspect-square"
              />
              <div>WebGenAI</div>
           </div></div> 
           
          <div className="flex overflow-hidden relative flex-col justify-end py-20 pr-6 pl-14 mt-9 w-full text-white rounded-xl max-w-[928px] min-h-[480px] max-md:px-5 max-md:max-w-full">
            <img
              loading="lazy"
              srcSet={images[0]}
              className="object-cover absolute inset-0 size-full"
            />
            <div className="relative mt-36 text-5xl font-black tracking-tighter leading-[60px] max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-[56px]">
              {webData.title}
            </div>
            <div className="relative mt-2 text-base leading-6 max-md:max-w-full">
              {webData.short_paragraph}
            </div>
          </div>
          <div className="px-4 py-6 mt-4 w-full max-w-[960px] max-md:max-w-full">
        <Countdown targetDate={webData.eventDate} />
      </div>
          <div className="px-4 py-6 mt-4 w-full max-w-[960px] max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow whitespace-nowrap text-neutral-900 max-md:mt-10">
                  <div className="justify-center items-center px-3 py-4 text-lg font-bold leading-6 bg-pink-100 rounded-xl max-md:px-5">
                    5
                  </div>
                  <div className="self-center mt-4 text-sm leading-5">Days</div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow whitespace-nowrap text-neutral-900 max-md:mt-10">
                  <div className="justify-center items-center px-3 py-4 text-lg font-bold leading-6 bg-pink-100 rounded-xl max-md:px-5">
                    12
                  </div>
                  <div className="self-center mt-4 text-sm leading-5">Hours</div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow whitespace-nowrap text-neutral-900 max-md:mt-10">
                  <div className="justify-center items-center px-3 py-4 text-lg font-bold leading-6 bg-pink-100 rounded-xl max-md:px-5">
                    36
                  </div>
                  <div className="self-center mt-4 text-sm leading-5">
                    Minutes
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow whitespace-nowrap text-neutral-900 max-md:mt-10">
                  <div className="justify-center items-center px-3 py-4 text-lg font-bold leading-6 bg-pink-100 rounded-xl max-md:px-5">
                    47
                  </div>
                  <div className="self-center mt-4 text-sm leading-5">
                    Seconds
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 text-2xl font-bold leading-7 text-neutral-900 max-md:max-w-full">
            Our memories
          </div>
          <div className="mt-7 w-full rounded-xl max-w-[928px] max-md:max-w-full">
  {images.length > 0 ? (
    images.map((image, index) => (
      <div key={index} className="mt-8 flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <img
            loading="lazy"
            src={image}
            className="grow w-full aspect-[1.82] max-md:max-w-full rounded-xl"
          />
        </div>
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col justify-center p-4 leading-[150%] text-stone-500 max-md:max-w-full">
            <div className="text-sm max-md:max-w-full">
              {webData.title}
            </div>
            <div className="mt-1 text-lg font-bold leading-6 text-neutral-900 max-md:max-w-full">
              Our favorite memories together
            </div>
            <div className="mt-1 text-base max-md:max-w-full">
              Share your favorite memories 
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-[#d1d5db]">No memories available</div>
  )}
</div>
<div className="mt-8 w-full rounded-xl max-w-[928px] max-md:max-w-full">
  {videos.length > 0 ? (
    videos.map((video, index) => (
      <div key={index} className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <video
            loading="lazy"
            src={video}
            controls
            className="grow w-full aspect-[1.82] max-md:max-w-full rounded-xl"
          />
        </div>
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col justify-center p-4 leading-[150%] text-stone-500 max-md:max-w-full">
            <div className="text-sm max-md:max-w-full">
              {webData.title}
            </div>
            <div className="mt-1 text-lg font-bold leading-6 text-neutral-900 max-md:max-w-full">
              Share a message with the couple
            </div>
            <div className="mt-1 text-base max-md:max-w-full">
              We can't wait to celebrate with you!
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-[#d1d5db]">No memories available</div>
  )}
</div>

      
        </div>
        <div className="flex flex-col justify-center w-full bg-white max-md:max-w-full">
          <div className="flex flex-col items-center px-16 pt-5 pb-20 w-full bg-zinc-50 max-md:px-5 max-md:max-w-full">
            <div className="flex flex-col px-4 py-3.5 mb-4 w-full max-w-[960px] max-md:max-w-full">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/11628fb35bdadc8f73498d603d1d089d45a0b456ddafe6686ffbf017bc58e90f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/11628fb35bdadc8f73498d603d1d089d45a0b456ddafe6686ffbf017bc58e90f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/11628fb35bdadc8f73498d603d1d089d45a0b456ddafe6686ffbf017bc58e90f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/11628fb35bdadc8f73498d603d1d089d45a0b456ddafe6686ffbf017bc58e90f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/11628fb35bdadc8f73498d603d1d089d45a0b456ddafe6686ffbf017bc58e90f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/11628fb35bdadc8f73498d603d1d089d45a0b456ddafe6686ffbf017bc58e90f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/11628fb35bdadc8f73498d603d1d089d45a0b456ddafe6686ffbf017bc58e90f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/11628fb35bdadc8f73498d603d1d089d45a0b456ddafe6686ffbf017bc58e90f?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="w-full aspect-[2.94] max-md:max-w-full"
              />
              <div className="mt-8 text-3xl font-bold leading-9 text-neutral-900 max-md:max-w-full">
                {webData.paragraph}
              </div>
              <div className="px-px mt-7 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                  <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                    <img
                      loading="lazy"
                      srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a3b76efb1ef9fdab13a32638fcc8c62c76c732623dd86385c449de937d3c5b50?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a3b76efb1ef9fdab13a32638fcc8c62c76c732623dd86385c449de937d3c5b50?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a3b76efb1ef9fdab13a32638fcc8c62c76c732623dd86385c449de937d3c5b50?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a3b76efb1ef9fdab13a32638fcc8c62c76c732623dd86385c449de937d3c5b50?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a3b76efb1ef9fdab13a32638fcc8c62c76c732623dd86385c449de937d3c5b50?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a3b76efb1ef9fdab13a32638fcc8c62c76c732623dd86385c449de937d3c5b50?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a3b76efb1ef9fdab13a32638fcc8c62c76c732623dd86385c449de937d3c5b50?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a3b76efb1ef9fdab13a32638fcc8c62c76c732623dd86385c449de937d3c5b50?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                      className="grow self-stretch w-full aspect-[1.79] max-md:mt-3"
                    />
                  </div>
                  <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                    <img
                      loading="lazy"
                      srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/986620cdac9016200f3c64dcc2ef0e2e756d194e5e1f5aa4dfa9c89af4feb5cc?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/986620cdac9016200f3c64dcc2ef0e2e756d194e5e1f5aa4dfa9c89af4feb5cc?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/986620cdac9016200f3c64dcc2ef0e2e756d194e5e1f5aa4dfa9c89af4feb5cc?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/986620cdac9016200f3c64dcc2ef0e2e756d194e5e1f5aa4dfa9c89af4feb5cc?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/986620cdac9016200f3c64dcc2ef0e2e756d194e5e1f5aa4dfa9c89af4feb5cc?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/986620cdac9016200f3c64dcc2ef0e2e756d194e5e1f5aa4dfa9c89af4feb5cc?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/986620cdac9016200f3c64dcc2ef0e2e756d194e5e1f5aa4dfa9c89af4feb5cc?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/986620cdac9016200f3c64dcc2ef0e2e756d194e5e1f5aa4dfa9c89af4feb5cc?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                      className="grow self-stretch w-full aspect-[1.79] max-md:mt-3"
                    />
                  </div>
                  <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                    <img
                      loading="lazy"
                      srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/e7503651e84e2f6b4de81fcdd8f7c4c1925cfc092153fbe51b46805b62d5cf5c?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/e7503651e84e2f6b4de81fcdd8f7c4c1925cfc092153fbe51b46805b62d5cf5c?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e7503651e84e2f6b4de81fcdd8f7c4c1925cfc092153fbe51b46805b62d5cf5c?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/e7503651e84e2f6b4de81fcdd8f7c4c1925cfc092153fbe51b46805b62d5cf5c?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/e7503651e84e2f6b4de81fcdd8f7c4c1925cfc092153fbe51b46805b62d5cf5c?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e7503651e84e2f6b4de81fcdd8f7c4c1925cfc092153fbe51b46805b62d5cf5c?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/e7503651e84e2f6b4de81fcdd8f7c4c1925cfc092153fbe51b46805b62d5cf5c?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/e7503651e84e2f6b4de81fcdd8f7c4c1925cfc092153fbe51b46805b62d5cf5c?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                      className="grow self-stretch w-full aspect-[1.79] max-md:mt-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="bg-gray-800 text-white py-8 mt-16">
  <div className="container mx-auto text-center">
    <h2 className="text-2xl font-bold mb-4">Open for Surprise</h2>
    <p className="mb-6">Stay tuned for something exciting coming your way!</p>
    <button className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300">
      Open Now
    </button>
  </div>
</footer>
      </div>
  );
}

export default Anniversary;
