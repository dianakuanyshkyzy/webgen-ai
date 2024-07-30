import party from 'party-js';
import React, { useState, useEffect } from 'react';

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

interface MomHomePageProps {
  wishData: WishData;
  id: string;
}

const MomHomePage: React.FC<MomHomePageProps> = ({ wishData, id }) => {
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

  useEffect(() => {
    party.confetti(document.body, {
      count: party.variation.range(100, 200),
    });
  }, []);

  return (
    <>
      <head>
        <title>WebGenAI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/party-js/1.0.0/party.min.js"></script>
      </head>
      <body className="font-sans bg-orange-200 text-brown-800">
        <div className="confetti"></div>
        <div className="party-pals">
          <header className="header flex justify-between items-center p-4 bg-white border-b border-orange-100">
            <div className="logo text-2xl font-bold">WebGenAI</div>
            <nav className="nav space-x-4">
              <a href="#welcome" className="text-brown-800 no-underline">About</a>
              <a href="#fun-memories" className="text-brown-800 no-underline">Fun Memories</a>
              <a href="#celebrate" className="text-brown-800 no-underline">Celebrate</a>
            </nav>
          </header>

          <section id="welcome" className="hero text-center py-20 text-white" style={{ backgroundColor: '#f90' }}>
            <h1 className="text-4xl">{webData.recipient}!</h1>
            <p>{webData.title}</p>
            <div className="party-started bg-white text-brown-800 p-8 rounded-lg m-auto max-w-xl mt-8">
              <h2 className="text-3xl">{webData.short_paragraph}</h2>
              <p>{webData.paragraph}</p>
              <div className="images flex justify-center gap-8 mt-8">
                <img src={imageUrls[0]} alt="Balloons" className="w-24 h-24" />
                <img src={imageUrls[1]} alt="Confetti" className="w-24 h-24" />
              </div>
            </div>
          </section>

          <section id="fun-memories" className="fun-memories py-8 text-center">
            <h2 className="text-3xl">Fun Memories</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {imageUrls.map((image, index) => (
                <div key={index} className="memory bg-white border border-orange-100 rounded-lg p-4">
                  <img src={image} alt={`Memory ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                  <p className="mt-2">{webData.wishes[index]}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="celebrate" className="celebrate py-8 text-center bg-orange-500 text-white">
            <h2 className="text-3xl">Celebrate with {webData.recipient}!</h2>
            <div className="birthday-wishes bg-white text-brown-800 p-8 rounded-lg m-auto max-w-xl mt-8">
              <h3 className="text-2xl">Birthday Wishes</h3>
              <ul className="list-none p-0 text-black">
                {webData.wishes.map((wish, index) => (
                  <li key={index} className="bg-gray-50 border border-orange-100 rounded-lg p-4 my-2">
                    {wish}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300 mt-8"
              onClick={handleSurpriseClick}
            >
              Open Song
            </button>
            {audio && (
              <div className="mt-4">
                <audio controls>
                  <source src={audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </section>
        </div>
      </body>
    </>
  );
};

export default MomHomePage;
