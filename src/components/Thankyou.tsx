'use client';

import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';

interface WishData {
  webData: {
    title: string;
    about: string;
    paragraph: string;
    images: string[];
    quotes: string[];
    videos: string[];
    wishes: string[];
    hobbies: string[];
    short_paragraph: string;
    characteristics: string[];
    facts: string[];
    senders: string;
    componentType: string;
    poemabout: string;
    gender: string;
    description: string;
    recipient: string;
    eventDate: string;
  };
}

interface ThankYouProps {
  wishData: WishData;
  id: string;
}

const ThankYou: React.FC<ThankYouProps> = ({ wishData, id }) => {
  const { webData } = wishData;
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [currentWish, setCurrentWish] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      setLoading(true);
      const audioResponse = await fetch(`/api/s3-audios?id=${id}`);

      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        setAudio(audioData.audio[0] || null);
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
          setAudio(data.audio_url);
        } else {
          const errorData = await generateResponse.json();
          console.error("Error generating audio:", errorData.error);
        }
      }
    } catch (error) {
      console.error("Error fetching or generating audio:", error);
    } finally {
      setLoading(false);
    }
  };

  const openImage = (image: string) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", background: "#f5f5f0", color: "#3b3b3b", padding: '20px' }}>
      <header style={{ position: 'sticky', top: '0', zIndex: '50', background: 'rgba(245, 245, 240, 0.9)', backdropFilter: 'blur(10px)', padding: '10px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <Link href="#" prefetch={false}>
            <GiftIcon className="h-6 w-6" />
            <span className="sr-only">Thank You Notes</span>
          </Link>
          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link href="#images" style={{ fontSize: '16px', fontWeight: '500', color: '#3b3b3b', textDecoration: 'none' }} prefetch={false}>Images</Link>
            <Link href="#videos" style={{ fontSize: '16px', fontWeight: '500', color: '#3b3b3b', textDecoration: 'none' }} prefetch={false}>Videos</Link>
            <Link href="#messages" style={{ fontSize: '16px', fontWeight: '500', color: '#3b3b3b', textDecoration: 'none' }} prefetch={false}>Messages</Link>
          </nav>
          <Button>Get Started</Button>
        </div>
      </header>
      <main>
        <section style={{ background: 'linear-gradient(to right, #f7c8d0, #f5f5dc)', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3em', fontWeight: 'bold', color: '#3b3b3b' }}>{webData.title}</h1>
            <p style={{ marginTop: '20px', maxWidth: '600px', margin: '0 auto', fontSize: '1.25em', color: '#3b3b3b' }}>
              {webData.about}
            </p>
          </div>
        </section>
        <section id="images" style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>Images</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
              {imageUrls.length > 0 ? (
                imageUrls.map((image, index) => (
                  <div key={index} style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', cursor: 'pointer' }} onClick={() => openImage(image)}>
                    <Image
                      src={image}
                      alt={`Memory ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      style={{ transition: 'transform 0.3s ease-in-out' }}
                      className="hover:scale-105"
                    />
                    <div style={{ position: 'absolute', bottom: '0', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', textAlign: 'center', padding: '5px', opacity: '0', transition: 'opacity 0.3s ease-in-out' }} className="hover:opacity-100">
                      {`Memory ${index + 1}`}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#d1d5db' }}>No memories available</p>
              )}
            </div>
          </div>
        </section>
        <section id="videos" style={{ padding: '60px 20px', background: '#f0f0e1' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>Videos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <div key={index} style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px' }}>
                    <video
                      src={video}
                      controls
                      style={{ width: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#d1d5db' }}>No videos available</p>
              )}
            </div>
          </div>
        </section>
        <section id="messages" style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>Messages</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {webData.wishes.map((wish, index) => (
                <div key={index} style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                  <p style={{ fontSize: '1.25em', color: '#3b3b3b' }}>{wish}</p>
                  <p style={{ textAlign: 'right', fontSize: '1em', color: '#9b9b9b' }}>- {webData.senders}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="kindness" style={{ padding: '60px 20px', background: '#e8e8d3' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>Words of Kindness</h2>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '1.25em', color: '#3b3b3b' }}>{webData.short_paragraph}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.25em', color: '#3b3b3b' }}>{webData.paragraph}</p>
            </div>
          </div>
        </section>
      </main>
      <footer style={{ textAlign: 'center', padding: '40px 20px', background: '#f5f5dc' }}>
        <button onClick={handleSurpriseClick} style={{ backgroundColor: '#ff69b4', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Generating...' : 'Open Song'}
        </button>
        <div style={{ marginTop: '20px', color: '#ff69b4', fontWeight: 'bold' }}>
          {audio && (
            <audio controls>
              <source src={audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </footer>
      {selectedImage && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }} onClick={closeImage}>
          <Image src={selectedImage} alt="Full format" layout="fill" objectFit="contain" style={{ borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
};

function GiftIcon(props: React.SVGProps<SVGSVGElement>) {
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
  );
}

export default ThankYou;
