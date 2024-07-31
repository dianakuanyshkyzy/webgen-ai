import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Image from 'next/image';

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
  };
}

interface GirlfriendProps {
  wishData: WishData;
  id: string;
}

const WaveImage: React.FC<{ src: string }> = ({ src }) => {
  const props = useSpring({
    loop: true,
    to: [{ transform: 'translateY(0px)' }, { transform: 'translateY(-20px)' }],
    from: { transform: 'translateY(-20px)' },
    config: { duration: 2000 },
  });

  return <animated.div style={props}><Image src={src} alt="Wave Image" className="w-full" /></animated.div>;
};

const Girlfriend: React.FC<GirlfriendProps> = ({ wishData, id }) => {
  const { webData } = wishData;
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentWish, setCurrentWish] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);

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
          throw new Error('Failed to fetch images');
        }
        const imageData = await imageResponse.json();
        setImages(imageData.images || []);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    const fetchVideos = async () => {
      try {
        const videoResponse = await fetch(`/api/s3-videos?id=${id}`);
        if (!videoResponse.ok) {
          throw new Error('Failed to fetch videos');
        }
        const videoData = await videoResponse.json();
        setVideos(videoData.videos || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    if (id) {
      fetchImages();
      fetchVideos();
    }
  }, [id]);

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
    return () => clearInterval(interval);
  }, [handleNextWish, webData.wishes.length]); // Add handleNextWish as a dependency
  

  if (!webData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-stone-100">
      <div className="flex flex-col justify-between items-center px-16 pt-12 pb-4 w-full text-gray-800 bg-stone-100 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between items-center w-full max-w-[1192px] max-md:flex-wrap max-md:max-w-full">
          <div className="flex gap-2 self-stretch my-auto text-2xl font-bold leading-6">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3b971d1759f903a46137417731bd1ee96e5a7fbf532739aaf967ac7b6817c468?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
              alt="Logo"
              width={32}
              height={32}
              className="shrink-0 w-8 aspect-square"
            />
            <div className="my-auto">WebGenAI</div>
          </div>
          <div className="flex gap-5 justify-between self-stretch my-auto text-xl font-medium leading-6 max-md:flex-wrap">
            <a href="#wishes-section">Wishes</a>
            <a href="#memories-section">Memories</a>
            <a href="#facts-section">Facts</a>
            <a href="#surprise-section">Surprise</a>
          </div>
        </div>
      </div>
      <div className="z-10 justify-center py-20 pl-20 w-full bg-stone-100 max-md:pl-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-4/5 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col justify-center items-center self-stretch my-auto max-md:mt-10 max-md:max-w-full">
              <div className="self-stretch text-9xl font-bold text-center text-gray-800 leading-[112px] max-md:max-w-full max-md:text-4xl max-md:leading-10">
                {webData.title}
              </div>
              <div className="mt-8 text-xl leading-8 text-center text-gray-800 w-[773px] max-md:max-w-full">
                {webData.about}
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-1/5 max-md:ml-0 max-md:w-full">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba5a43fcb79ad8d3576933b7f49acbd2a36d871482760fe106c7fed3811a0bc8?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
              alt="Side Image"
              width={241}
              height={502}
              className="shrink-0 mt-32 max-w-full aspect-[0.48] max-md:mt-10"
            />
          </div>
        </div>
      </div>
      <div id="wishes-section" className="flex justify-center items-center px-16 py-16 w-full bg-stone-100 max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col w-full max-w-[1192px] max-md:max-w-full">
          <div className="self-center text-6xl font-bold text-center text-gray-800 w-[922px] max-md:max-w-full max-md:text-4xl">
            Let's see what what your loved ones wish you:
          </div>
          <div className="justify-end py-16 pl-20 mt-16 bg-white rounded-3xl max-md:pl-5 max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow text-gray-800 max-md:mt-10 max-md:max-w-full">
                  <div className="text-5xl font-semibold text-center max-md:max-w-full max-md:text-4xl">
                    Wishes:
                  </div>
                  <div className="mt-4 text-xl leading-8 max-md:max-w-full">
                    {webData.senders}
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="grow max-md:mt-10 max-md:max-w-full">
                  <div className="flex flex-col w-[82%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col grow items-center py-6 px-6 w-full bg-fuchsia-300 rounded-2xl max-md:mt-8">
                      <div className="flex justify-between w-full">
                        <button
                          className="text-gray-800 font-bold text-2xl"
                          onClick={handlePrevWish}
                        >
                          &lt;
                        </button>
                        <button
                          className="text-gray-800 font-bold text-2xl"
                          onClick={handleNextWish}
                        >
                          &gt;
                        </button>
                      </div>
                      <div className="flex flex-col items-center mt-4">
                        <div className="mt-4 text-3xl font-medium tracking-tight"></div>
                        <div className="mt-4 text-xl leading-8 text-center">
                          {webData.wishes[currentWish]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="memories-section" className="self-center text-6xl font-bold text-center text-gray-800 w-[922px] max-md:max-w-full max-md:text-4xl mb-10">
        Thank you for the memories!
      </div>
      <div className="relative w-full max-w-5xl mx-auto">
        <div
          className="group flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide transition-all duration-300 ease-in-out"
          onMouseEnter={(e) => {
            const carousel = e.currentTarget;
            const speed = 0.1;
            const handleMouseMove = (e: any) => {
              const { clientX, currentTarget } = e;
              const { left, right, width } = currentTarget.getBoundingClientRect();
              const position = (clientX - left) / width;
              carousel.scrollLeft +=
                (position < 0.5 ? -1 : 1) * speed * (Math.abs(0.5 - position) * 2) * carousel.scrollWidth;
            };
            carousel.addEventListener("mousemove", handleMouseMove);
            return () => {
              carousel.removeEventListener("mousemove", handleMouseMove);
            };
          }}
          onMouseLeave={() => {}}
        >
          {imageUrls.length > 0 ? (
            imageUrls.map((image, index) => (
              <Image
                src={image}
                key={index}
                width={600}
                height={400}
                className="object-cover rounded-lg aspect-video shrink-0 w-full max-w-[400px]"
                alt={`Memory ${index + 1}`}
              />
            ))
          ) : (
            <p>No memories available</p>
          )}
        </div>
        <div
          className="group flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide transition-all duration-300 ease-in-out"
          onMouseEnter={(e) => {
            const carousel = e.currentTarget;
            const speed = 0.1;
            const handleMouseMove = (e: any) => {
              const { clientX, currentTarget } = e;
              const { left, right, width } = currentTarget.getBoundingClientRect();
              const position = (clientX - left) / width;
              carousel.scrollLeft +=
                (position < 0.5 ? -1 : 1) * speed * (Math.abs(0.5 - position) * 2) * carousel.scrollWidth;
            };
            carousel.addEventListener("mousemove", handleMouseMove);
            return () => {
              carousel.removeEventListener("mousemove", handleMouseMove);
            };
          }}
          onMouseLeave={() => {}}
        >
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <video
                src={video}
                key={index}
                width={600}
                height={400}
                className="object-cover rounded-lg aspect-video shrink-0 w-full max-w-[400px]"
                controls
              />
            ))
          ) : (
            <p>No videos available</p>
          )}
        </div>
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
      <div className="pt-16 pb-10 pl-20 w-full bg-stone-100 max-md:pl-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col ml-5 w-[21%] max-md:ml-0 max-md:w-full">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a3dc14860dfe559fe10bf6d4397e732b83d07d3a92f1daa9b5c966c643f54f7c?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
              alt="Side Image"
              width={249}
              height={532}
              className="grow shrink-0 mt-16 max-w-full aspect-[0.53] fill-fuchsia-300 w-[249px] max-md:mt-10 transform scaleX-[-1]"
            />
          </div>
          <div id="facts-section" className="flex flex-col w-[79%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col font-bold text-center text-gray-800 max-md:mt-10 max-md:max-w-full">
              <div className="text-6xl max-md:max-w-full max-md:text-4xl">
                {webData.short_paragraph}
              </div>
              <div className="mt-16 text-3xl max-md:mt-10 max-md:max-w-full"></div>
              <div className="self-center mt-16 text-xl leading-8 w-[691px] max-md:mt-10 max-md:max-w-full"></div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[21%] max-md:ml-0 max-md:w-full">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a3dc14860dfe559fe10bf6d4397e732b83d07d3a92f1daa9b5c966c643f54f7c?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
              alt="Side Image"
              width={249}
              height={532}
              className="grow shrink-0 mt-16 max-w-full aspect-[0.53] fill-fuchsia-300 w-[249px] max-md:mt-10"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center px-16 py-16 mt-1 w-full bg-stone-100 max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col max-w-full w-[1022px]">
          <div className="mx-6 max-md:mr-2.5 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-[45%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col text-gray-800 max-md:mt-8 max-md:max-w-full">
                  <div className="text-4xl font-bold max-md:max-w-full">
                    {webData.recipient} ...
                  </div>
                  <div className="mt-4 text-xl leading-8 max-md:max-w-full">
                    {webData?.hobbies[0]}
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-[55%] max-md:ml-0 max-md:w-full">
                {imageUrls[0] && (
                  <Image
                    src={imageUrls[0]}
                    alt="Memory 1"
                    width={600}
                    height={400}
                    className="z-10 grow w-full aspect-[1.01] max-md:mt-8 max-md:max-w-full"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="mt-16 max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                {imageUrls[1] && (
                  <Image
                    src={imageUrls[1]}
                    alt="Memory 2"
                    width={600}
                    height={400}
                    className="grow w-full aspect-[1.01] max-md:mt-8 max-md:max-w-full"
                  />
                )}
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col text-gray-800 max-md:mt-8 max-md:max-w-full">
                  <div className="text-4xl font-bold max-md:max-w-full">
                    {webData.recipient}...
                  </div>
                  <div className="mt-4 text-xl leading-8 max-md:max-w-full">
                    {webData.hobbies[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col text-gray-800 max-md:mt-8 max-md:max-w-full">
                  <div className="text-4xl font-bold max-md:max-w-full">
                    {webData.recipient} ...
                  </div>
                  <div className="mt-4 text-xl leading-8 max-md:max-w-full">
                    {webData.hobbies[2]}
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                {imageUrls[2] && (
                  <Image
                    src={imageUrls[2]}
                    alt="Memory 3"
                    width={600}
                    height={400}
                    className="grow w-full aspect-[1.01] max-md:mt-8 max-md:max-w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Girlfriend;
