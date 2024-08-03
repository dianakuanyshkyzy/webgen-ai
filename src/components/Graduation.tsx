import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
    componentType: string;
    poemabout: string;
  }
}

interface GraduationProps {
  wishData: WishData;
  id: string;
}

const Graduation: React.FC<GraduationProps> = ({ wishData, id }) => {
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
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{webData.title}</h1>
          <p className="mt-4 text-lg md:text-xl">
            {webData.short_paragraph}
          </p>
          <div className="mt-8">
            <Image
              src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg"
              width={1000}
              height={300}
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
              <Image
                src={imageUrls[0]}
                width={400}
                height={500}
                alt="Graduate Portrait"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">About the {webData.recipient}</h2>
              <p className="mt-4 text-lg text-gray-600">
                {webData.about}
              </p>
              <p className="mt-4 text-lg text-gray-600">
                {webData.paragraph}
              </p>
            </div>
          </div>
        </section>
        <section className="bg-gray-100 py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tight text-center text-blue-600">Gallery</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imageUrls.length > 0 ? (
                <>
                  <div className="lg:col-span-2 lg:row-span-2">
                    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                      <Image
                        src={imageUrls[0]}
                        alt="Gallery Image"
                        width={600}
                        height={400}
                        className="aspect-[3/2] w-full overflow-hidden rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
                      />
                      <Image
                        src={imageUrls[1]}
                        alt="Gallery Image"
                        width={400}
                        height={600}
                        className="aspect-[2/3] w-full overflow-hidden rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="col-span-2 row-span-2 overflow-hidden rounded-lg">
                        <Image
                          src={imageUrls[2]}
                          alt="Gallery Image"
                          width={1200}
                          height={800}
                          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="text-center text-white">
                            <h3 className="text-2xl font-bold">Stunning Landscape</h3>
                            <p className="text-sm">Capture the beauty of nature</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    <Image
                      src={imageUrls[3]}
                      alt="Gallery Image"
                      width={400}
                      height={300}
                      className="aspect-[4/3] w-full overflow-hidden rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    <Image
                      src={imageUrls[4]}
                      alt="Gallery Image"
                      width={300}
                      height={400}
                      className="aspect-[3/4] w-full overflow-hidden rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    <Image
                      src={imageUrls[5]}
                      alt="Gallery Image"
                      width={400}
                      height={400}
                      className="aspect-square w-full overflow-hidden rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
                    />
                   
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-600">Loading images...</p>
              )}
            </div>
          </div>
        </section>
        <section className="bg-white py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tight text-center text-blue-600">Messages for the Graduate</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {webData.wishes.map((wish, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-2">        
                  </div>
                  <p className="mt-4 text-gray-600">{wish}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-blue-600 py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight"> {webData.recipient}, open this for a surprise!</h2>
            <p className="mt-4 text-lg">
            </p>
            <div className="mt-8">
              
            <Button
              
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-blue-600 font-medium shadow-sm transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
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

export default Graduation;
