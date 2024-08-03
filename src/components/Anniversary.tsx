import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface WishData {
  webData: {
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
  };
}

interface AnniversaryProps {
  wishData: WishData;
  id: string;
}

const Anniversary: React.FC<AnniversaryProps> = ({ wishData, id }) => {
  const { webData } = wishData;
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentWish, setCurrentWish] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const songUrl = searchParams.get('songUrl');

  useEffect(() => {
    if (songUrl) {
      const audioElement = new Audio(songUrl);
      audioElement.loop = true;
      audioElement.play().catch(() => {
        console.log('Auto-play was prevented. Click the button to play the audio.');
      });
      setAudio(songUrl); // Save the audio URL to state
    }
  }, [songUrl]);

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
      // Check if audio already exists in S3
      const audioResponse = await fetch(`/api/s3-audios?id=${id}`);

      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        const audioElement = new Audio(audioData.audio[0]);
        audioElement.loop = true;
        setAudio(audioElement.src);
        audioElement.play();
      } else {
        // Generate audio if it doesn't exist
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

  const handleGenerateDescriptions = async () => {
    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      console.log("Response received from generate-description:", response);

      if (response.ok) {
        const descriptionResponse = await fetch("/api/generate-cute-photos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ descriptions: data.descriptions, id }),
        });

        const generatedData = await descriptionResponse.json();
        if (descriptionResponse.ok) {
          setGeneratedImages(generatedData.generatedImages);
        } else {
          console.error("Error generating cute photos:", generatedData.error);
        }
      } else {
        console.error("Error generating descriptions:", data.error);
      }
    } catch (error: any) {
      console.error("Error generating descriptions:", error.message);
    }
  };

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
            <Image
              alt=""
              loading="lazy"
              width={30}
              height={30}
              src="/logo.png"
              className="flex-1 shrink-0 my-auto w-full aspect-square"
            />
            <div>WebGenAI</div>
          </div>
        </div>

        <div className="flex overflow-hidden relative flex-col justify-end py-20 pr-6 pl-14 mt-9 w-full text-white rounded-xl max-w-[928px] min-h-[480px] max-md:px-5 max-md:max-w-full">
          <Image
            alt="image"
            loading="lazy"
            width={1920}
            height={1080}
            src={imageUrls[0]}
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
                <div className="self-center mt-4 text-sm leading-5">Minutes</div>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow whitespace-nowrap text-neutral-900 max-md:mt-10">
                <div className="justify-center items-center px-3 py-4 text-lg font-bold leading-6 bg-pink-100 rounded-xl max-md:px-5">
                  47
                </div>
                <div className="self-center mt-4 text-sm leading-5">Seconds</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 text-2xl font-bold leading-7 text-neutral-900 max-md:max-w-full">
          Our memories
        </div>
        <div className="mt-7 w-full rounded-xl max-w-[928px] max-md:max-w-full">
          {imageUrls.length > 0 ? (
            imageUrls.map((image, index) => (
              <div key={index} className="mt-8 flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                  <Image
                    alt="image"
                    loading="lazy"
                    src={image}
                    width={600}
                    height={400}
                    className="grow w-full aspect-[1.82] max-md:max-w-full rounded-xl"
                  />
                </div>
                <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col justify-center p-4 leading-[150%] text-stone-500 max-md:max-w-full">
                    <div className="text-sm max-md:max-w-full">
                      {webData.title}
                    </div>
                    <div className="mt-1 text-lg font-bold leading-6 text-neutral-900 max-md:max-w-full">
                      Here is what people wish you!
                    </div>
                    <div className="mt-1 text-base max-md:max-w-full">
                      {webData.wishes[index % webData.wishes.length]} {/* Display wishes */}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-[#d1d5db]"></div>
          )}
        </div>
        <div className="mt-8 w-full rounded-xl max-w-[928px] max-md:max-w-full">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div key={index} className="flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                  <video
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
                      {webData.wishes[index % webData.wishes.length]} {/* Display wishes */}
                    </div>
                    <div className="mt-1 text-base max-md:max-w-full">
                      We can't wait to celebrate with you!
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-[#d1d5db]"></div>
          )}
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Open for Surprise</h2>
          <p className="mb-6">Stay tuned for something exciting coming your way!</p>
          <button 
            className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300"
            onClick={handleSurpriseClick}
          >
            Open Now
          </button>
          
        </div>
      </footer>
    </div>
  );
};

export default Anniversary;
