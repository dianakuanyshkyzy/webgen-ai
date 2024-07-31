import { Card } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {Button} from './ui/button';
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

interface GetWellProps {
  wishData: WishData;
  id: string;
}

const GetWell: React.FC<GetWellProps> = ({ wishData, id }) => {
  const { webData } = wishData;
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showSurprise, setShowSurprise] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  
  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const toggleSurprise = () => {
    setShowSurprise(!showSurprise);
  };

  const openImage = (image: string) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", background: "url('https://images.pexels.com/photos/992734/pexels-photo-992734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1') no-repeat center center fixed", backgroundSize: "100%", padding: '20px', borderRadius: '15px' }}>
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '15px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#ff69b4' }}>Get Well Soon</h1>
          <p style={{ color: '#ffb6c1', marginTop: '8px' }}>We're all rooting for your speedy recovery!</p>
        </div>
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25em', fontWeight: '600', marginBottom: '16px', color: '#ff69b4' }}>Messages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {webData.wishes.map((wish, index) => (
              <Card key={index} style={{ padding: '16px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                <div>
                  <p style={{ fontWeight: '500', color: '#1f2937' }}>{wish}</p>
                  <p style={{ color: '#ffb6c1' }}>- {webData.senders}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25em', fontWeight: '600', marginBottom: '16px', color: '#ff69b4' }}>Images</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
            {imageUrls.length > 0 ? (
              imageUrls.map((image, index) => (
                <div key={index} style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', cursor: 'pointer' }} onClick={() => openImage(image)}>
                  <img
                    src={image}
                    alt={`Memory ${index + 1}`}
                    style={{ objectFit: 'cover', width: '100%', height: '100%', transition: 'transform 0.3s ease-in-out' }}
                    width={300}
                    height={300}
                  />
                  <div style={{ position: 'absolute', bottom: '0', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', textAlign: 'center', padding: '5px', opacity: '0', transition: 'opacity 0.3s ease-in-out' }} className="description">
                    {`Memory ${index + 1}`}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#d1d5db' }}>No memories available</div>
            )}
          </div>
        </section>
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25em', fontWeight: '600', marginBottom: '16px', color: '#ff69b4' }}>Videos</h2>
          <div style={{ position: 'relative' }}>
            {videos.length > 0 ? (
              <div>
                <button onClick={prevVideo} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#ff69b4', color: 'white', padding: '8px', borderRadius: '50%' }}>
                  {"<"}
                </button>
                <video
                  src={videos[currentVideo]}
                  controls
                  style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                >
                  Your browser does not support the video tag.
                </video>
                <button onClick={nextVideo} style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#ff69b4', color: 'white', padding: '8px', borderRadius: '50%' }}>
                  {">"}
                </button>
              </div>
            ) : (
              <div style={{ color: '#d1d5db' }}>No memories available</div>
            )}
          </div>
        </section>
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25em', fontWeight: '600', marginBottom: '16px', color: '#ff69b4' }}>Words of Kindness</h2>
          <p style={{ marginBottom: '16px', color: '#1f2937' }}>{webData.short_paragraph}</p>
          <p style={{ color: '#1f2937' }}>{webData.paragraph}</p>
        </section>
        <footer style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
              
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
      {selectedImage && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }} onClick={closeImage}>
          <img src={selectedImage} alt="Full format" style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
};

export default GetWell;