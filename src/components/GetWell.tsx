import { Card } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect } from "react";

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
  componentType: string;
  poemabout: string;
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

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const imageResponse = await fetch(`/api/s3-images?id=${id}`);
        const videoResponse = await fetch(`/api/s3-videos?id=${id}`);

        if (!imageResponse.ok) {
          throw new Error("Failed to fetch images");
        }
        if (!videoResponse.ok) {
          throw new Error("Failed to fetch videos");
        }

        const imageData = await imageResponse.json();
        const videoData = await videoResponse.json();

        setImages(imageData.images || []);
        setVideos(videoData.videos || []);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    if (id) {
      fetchMedia();
    }
  }, [id]);

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Get Well Soon</h1>
          <p className="text-muted-foreground mt-2">We're all rooting for your speedy recovery!</p>
        </div>
        <section>
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {webData.wishes.map((wish, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <p className="font-medium">{wish}</p>
                  <p className="text-muted-foreground">- {webData.senders}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.length > 0 ? (
              images.map((image, index) => (
                <Link key={index} href="#" className="relative overflow-hidden rounded-lg group" prefetch={false}>
                  <img
                    src={image}
                    alt={`Memory ${index + 1}`}
                    className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                    width={300}
                    height={300}
                  />
                </Link>
              ))
            ) : (
              <div className="text-[#d1d5db]">No memories available</div>
            )}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Videos</h2>
          <div className="relative">
            {videos.length > 0 ? (
              <div>
                <button onClick={prevVideo} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full">
                  {"<"}
                </button>
                <video
                  src={videos[currentVideo]}
                  controls
                  className="w-full h-auto rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
                <button onClick={nextVideo} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full">
                  {">"}
                </button>
              </div>
            ) : (
              <div className="text-[#d1d5db]">No memories available</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GetWell;
