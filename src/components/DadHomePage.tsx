import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
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
}

interface DadHomePageProps {
  wishData: WishData;
  id: string;
}

const DadHomePage: React.FC<DadHomePageProps> = ({ wishData, id }) => {
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
      // Check if audio already exists in S3
      const audioResponse = await fetch(`/api/s3-audios?id=${id}`);

      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        setAudio(audioData.audio[0] || null);
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
          setAudio(data.audio_url);
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
    <div className="dad-home-page font-sans bg-orange-200 text-brown-800">
      <header className="header flex justify-between items-center p-4 bg-white border-b border-orange-100">
        <div className="logo text-2xl font-bold">WishAI</div>
        <nav className="nav space-x-4">
          <a href="#about" className="text-brown-800 no-underline">About</a>
          <a href="#gallery" className="text-brown-800 no-underline">Gallery</a>
          <a href="#video" className="text-brown-800 no-underline">Video Message</a>
          <a href="#poems" className="text-brown-800 no-underline">Poems</a>
          <a href="#wishes" className="text-brown-800 no-underline">Wishes</a>
        </nav>
      </header>
      <section className="hero text-center py-20 text-white" style={{ backgroundImage: `url(${webData.images?.[0] || ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h1 className="text-4xl">{webData.title}</h1>
        <h2 className="text-2xl">{webData.short_paragraph}</h2>
      </section>
      <section id="about" className="about py-8 text-center">
        <h2 className="text-3xl">About {webData.recipient}</h2>
        <p className="my-4">{webData.about}</p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {webData.hobbies?.map((hobby, index) => (
            <div className="card bg-white border border-orange-100 rounded-lg p-4" key={index}>
              <div className="icon">⭐</div>
              <h3 className="text-xl">{hobby}</h3>
            </div>
          ))}
        </div>
      </section>
      <section id="gallery" className="gallery py-8 text-center">
        <h2 className="text-3xl">Photo Gallery</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {imageUrls.length > 0 ? (
            imageUrls.map((image, index) => (
              <img src={image}></img>
              ))
          ) : (
            <p>No images available</p>
          )}
        </div>
      </section>
      <section id="video" className="video py-8 text-center">
        <h2 className="text-3xl">Video Message</h2>
        <div className="video-message grid gap-4">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <video key={index} controls src={video} className="video-item w-full h-72 rounded-lg" />
            ))
          ) : (
            <p>No videos available</p>
          )}
        </div>
      </section>
      <section id="poems" className="poems py-8 text-center">
        <h2 className="text-3xl">Personalized Quotes</h2>
        {webData.quotes?.map((quote, index) => (
          <div className="poem bg-white border border-orange-100 rounded-lg p-4 my-4" key={index}>
            <div className="content">
              <p>{quote}</p>
            </div>
          </div>
        ))}
      </section>
      <section id="wishes" className="wishes py-8 text-center">
        <h2 className="text-3xl">Wishes</h2>
        {webData.wishes?.map((wish, index) => (
          <div className="wish-item bg-white border border-orange-100 rounded-lg p-4 my-4" key={index}>
            <p>{wish}</p>
          </div>

        ))}
      </section>
      <footer className="footer py-8 bg-orange-50">
        <div className="footer-content flex items-center justify-center">
          <div className="avatar w-24 h-24 bg-orange-100 rounded-full"></div>
          <div className="family-info ml-4 text-left">
            <h3 className="text-xl">{webData.senders?.split('\n')[0]}</h3>
            <p>{webData.senders?.split('\n')[1]}</p>
          </div>
        </div>
        <Button
              href="#"
              className="rounded-md bg-[#4b5563] px-4 py-2 text-[#f5f5f5] hover:bg-[#6b7280]"
              onClick={handleSurpriseClick}
            >
              Click me!
            </Button>
            {audio && (
              <div className="mt-4">
                <audio controls>
                  <source src={audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
      </footer>
    </div>
  );
};

export default DadHomePage;
