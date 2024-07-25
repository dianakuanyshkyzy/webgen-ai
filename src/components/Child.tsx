// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   QuoteIcon,
//   CakeIcon,
//   FlowerIcon,
//   PaletteIcon,
//   PawPrintIcon,
// } from "lucide-react";
// import confetti from "canvas-confetti";
// import { useSpring, animated } from "@react-spring/web";
// import React, { useState, useEffect } from "react";
// import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3Client = new S3Client({
//   region: process.env.NEXT_PUBLIC_AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
//   },
// });

// function AnimatedImage({ src, index, total }) {
//   const angle = (index / total) * 2 * Math.PI;
//   const radius = 150; // Adjust the radius as needed

//   const styles = useSpring({
//     from: { transform: `rotate(${angle}rad) translate(${radius}px) rotate(${-angle}rad)` },
//     to: async (next) => {
//       while (1) {
//         await next({ transform: `rotate(${angle + 360}deg) translate(${radius}px) rotate(${-angle - 360}rad)` });
//       }
//     },
//     config: { duration: 240000 },
//     reset: true,
//   });

//   return (
//     <animated.img
//       src={src}
//       className="absolute top-1/2 left-1/2 w-24 h-24 object-cover rounded-lg"
//       style={{
//         transform: `translate(-50%, -50%) rotate(${angle}rad) translate(${radius}px) rotate(${-angle}rad)`,
//         ...styles,
//       }}
//     />
//   );
// }

// interface WishData {
//   title: string;
//   recipient: string;
//   about: string;
//   images: string[];
//   quotes: string[];
//   videos: string[];
//   wishes: string[];
//   hobbies: string[];
//   paragraph: string;
//   characteristics: string[];
//   short_paragraph: string;
//   senders: string;
//   gender: string;
//   componentType: string;
//   poemabout: string;
// }

// interface ChildProps {
//   wishData: WishData;
//   id: string;
// }

// const Child: React.FC<ChildProps> = ({ wishData, id }) => {
//   const { webData } = wishData;
//   const [images, setImages] = useState<string[]>([]);
//   const [videos, setVideos] = useState<string[]>([]);
//   const [audio, setAudio] = useState<string | null>(null);
//   const [currentWish, setCurrentWish] = useState(0);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const imageResponse = await fetch(`/api/s3-images?id=${id}`);

//         if (!imageResponse.ok) {
//           throw new Error("Failed to fetch images");
//         }

//         const imageData = await imageResponse.json();
//         setImages(imageData.images || []);
//       } catch (error) {
//         console.error("Error fetching images:", error);
//       }
//     };

//     const fetchVideos = async () => {
//       try {
//         const videoResponse = await fetch(`/api/s3-videos?id=${id}`);

//         if (!videoResponse.ok) {
//           throw new Error("Failed to fetch videos");
//         }

//         const videoData = await videoResponse.json();
//         setVideos(videoData.videos || []);
//       } catch (error) {
//         console.error("Error fetching videos:", error);
//       }
//     };

  

//     // const fetchAudio = async () => {
//     //   try {
//     //     const audioResponse = await fetch(`/api/s3-audios?id=${id}`);

//     //     if (!audioResponse.ok) {
//     //       throw new Error("Failed to fetch audios");
//     //     }

//     //     const audioData = await audioResponse.json();
//     //     if (audioData.audio && audioData.audio.length > 0) {
//     //       setAudio(audioData.audio[0]);
//     //     } else {
//     //       setAudio(null);
//     //     }
//     //   } catch (error) {
//     //     console.error("Error fetching audios:", error);
//     //   }
//     // };

//     if (id) {
//       // fetchAudio(); 
//       fetchImages();
//       fetchVideos();
//     }
//   }, [id]);

//   const handleNextWish = () => {
//     setCurrentWish((prev) => (prev + 1) % webData?.wishes.length);
//   };

//   const handlePrevWish = () => {
//     setCurrentWish((prev) => (prev - 1 + webData?.wishes.length) % webData.wishes.length);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       handleNextWish();
//     }, 5000);
//     return () => clearInterval(interval); // Cleanup the interval on component unmount
//   }, [webData.wishes.length]);

//   if (!webData) {
//     return <div>Loading...</div>; // Adjust this to your preferred loading state
//   }

//   const throwConfetti = () => {
//     confetti({
//       particleCount: 400,
//       spread: 200,
//       origin: { y: 0.6 },
//     });
//   };

//   const handleSurpriseClick = async () => {
//     try {
//       // Check if audio already exists in S3
//       const audioResponse = await fetch(`/api/s3-audios?id=${id}`);

//       if (audioResponse.ok) {
//         const audioData = await audioResponse.json();
//         setAudio(audioData.audio[0] || null);
//       } else {
//         // Generate audio if it doesn't exist
//         const generateResponse = await fetch("/api/generate-songs", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             prompt: webData.recipient,
//             make_instrumental: false,
//             wait_audio: true,
//           }),
//         });

//         if (generateResponse.ok) {
//           const data = await generateResponse.json();
//           setAudio(data.audio_url);
//         } else {
//           const errorData = await generateResponse.json();
//           console.error("Error generating audio:", errorData.error);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching or generating audio:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-dvh bg-[#f0f8ff] text-foreground">
//       <header className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
//         <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
//           <div className="flex flex-col items-center justify-center space-y-6">
//             <div
//               className="rounded-full bg-pink-300 p-8 text-9xl text-pink-700 animate-bounce cursor-pointer"
//               onClick={throwConfetti}
//             >
//               🎉
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
//                 {webData.title}!
//               </h1>
//             </div>
//           </div>
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <img
//               src={images[0]}
//               width={600}
//               height={600}
//               alt="Birthday Cake"
//               className="max-w-full rounded-lg"
//             />

//             {/* replace with generated image */}
//           </div>
//         </div>
//       </header>
//       <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
//         <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
//               Memories Over the Years
//             </h2>

//             <div className="relative h-96 w-full">
//               {images.map((src, index) => (
//                 <AnimatedImage
//                   key={index}
//                   src={src}
//                   index={index}
//                   total={images.length}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
//               A Message for You
//             </h2>
//             <p className="max-w-md text-center text-muted-foreground">
//               {webData.paragraph}
//             </p>
//           </div>

//           <Card className="w-full bg-pink-100">
//             <CardHeader>
//               <CardTitle>Birthday wishes for {webData.recipient}</CardTitle>
//               <CardDescription>
//                 Inspiring and heartfelt wishes to celebrate {webData.recipient}'s
//                 special day.
//               </CardDescription>
//             </CardHeader>
//             <Card className="w-full bg-pink-100">
//               <CardContent className="grid gap-6">
//                 {webData.wishes.map((wish, index) => (
//                   <blockquote key={index} className="flex flex-col gap-2">
//                     <div className="flex items-center gap-2 text-sm font-medium">
//                       <QuoteIcon className="h-5 w-5 text-primary" />
//                       <span>{wish}</span>
//                     </div>
//                   </blockquote>
//                 ))}
//               </CardContent>
//             </Card>
//           </Card>

//           <Card className="w-full bg-blue-100 text-blue-900">
//             <CardHeader>
//               <CardTitle>Fun Facts About {webData.recipient}</CardTitle>
//               <CardDescription>
//                 You are ...
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="grid gap-6">
//               {webData.facts.map((fact, index) => (
//                 <div key={index} className="flex items-center gap-4">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-blue-100">
//                     {/* You can dynamically switch icons here based on the fact type */}
//                     {index === 0 && <CakeIcon className="h-6 w-6" />}
//                     {index === 1 && <FlowerIcon className="h-6 w-6" />}
//                     {index === 2 && <PaletteIcon className="h-6 w-6" />}
//                     {index === 3 && <PawPrintIcon className="h-6 w-6" />}
//                   </div>
//                   <div>
//                     <div className="font-medium">{fact}</div>
//                     <div className="text-sm text-blue-900/80">
//                       {fact.description}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>
//       </section>
//       <section className="py-16 bg-purple-100">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="mb-8 text-3xl font-bold text-blue-900">
//             Memorable Videos
//           </h2>
//           <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//             {videos.map((video, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col items-center w-full bg-white rounded-lg shadow-lg"
//               >
//                 <video className="w-full rounded-t-lg" controls>
//                   <source src={video} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Special Moment {index + 1}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     A cherished memory from our wonderful journey together.
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section id="surprise" className="py-16 bg-yellow-100">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="mb-8 text-3xl font-bold text-yellow-900">
//             A Special Surprise
//           </h2>
//           <div className="rounded-lg bg-yellow-200 p-6 shadow-lg">
//             <h3 className="mb-4 text-xl font-bold text-yellow-900">
//               Open to see a special surpise!
//             </h3>
//             <p className="mb-4 text-yellow-800"></p>
//             <Button
//               href="#"
//               className="rounded-md bg-yellow-300 px-4 py-2 text-yellow-900 hover:bg-yellow-400"
//               onClick={handleSurpriseClick}
//             >
//               Click me!
//             </Button>
//             {audio && (
//               <div className="mt-4">
//                 <audio controls>
//                   <source src={audio} type="audio/mpeg" />
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Child;
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  QuoteIcon,
  CakeIcon,
  FlowerIcon,
  PaletteIcon,
  PawPrintIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useSpring, animated } from "@react-spring/web";
import React, { useState, useEffect } from "react";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function AnimatedImage({ src, index, total }) {
  const angle = (index / total) * 2 * Math.PI;
  const radius = 150; // Adjust the radius as needed

  const styles = useSpring({
    from: { transform: `rotate(${angle}rad) translate(${radius}px) rotate(${-angle}rad)` },
    to: async (next) => {
      while (1) {
        await next({ transform: `rotate(${angle + 360}deg) translate(${radius}px) rotate(${-angle - 360}rad)` });
      }
    },
    config: { duration: 240000 },
    reset: true,
  });

  return (
    <animated.img
      src={src}
      className="absolute top-1/2 left-1/2 w-24 h-24 object-cover rounded-lg"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}rad) translate(${radius}px) rotate(${-angle}rad)`,
        ...styles,
      }}
    />
  );
}

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

interface ChildProps {
  wishData: WishData;
  id: string;
}

const Child: React.FC<ChildProps> = ({ wishData, id }) => {
  const { webData } = wishData;
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentWish, setCurrentWish] = useState(0);

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

  const throwConfetti = () => {
    confetti({
      particleCount: 400,
      spread: 200,
      origin: { y: 0.6 },
    });
  };

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

  // const handleGenerateDescriptions = async () => {
  //   try {
  //     const response = await fetch("/api/generate-description", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       const descriptionResponse = await fetch("/api/generate-cute-photos", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ descriptions: data.descriptions, id }),
  //       });

  //       const generatedData = await descriptionResponse.json();
  //       if (descriptionResponse.ok) {
  //         setGeneratedImages(generatedData.generatedImages);
  //       } else {
  //         console.error("Error generating cute photos:", generatedData.error);
  //       }
  //     } else {
  //       console.error("Error generating descriptions:", data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error generating descriptions:", error.message);
  //   }
  // };
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
  
  

  return (
    <div className="flex flex-col min-h-dvh bg-[#f0f8ff] text-foreground">
      <header className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div
              className="rounded-full bg-pink-300 p-8 text-9xl text-pink-700 animate-bounce cursor-pointer"
              onClick={throwConfetti}
            >
              🎉
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                {webData.title}!
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <img
              src={images[0]}
              width={600}
              height={600}
              alt="Birthday Cake"
              className="max-w-full rounded-lg"
            />

            {/* replace with generated image */}
          </div>
        </div>
      </header>
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Memories Over the Years
            </h2>

            <div className="relative h-96 w-full">
              {images.map((src, index) => (
                <AnimatedImage
                  key={index}
                  src={src}
                  index={index}
                  total={images.length}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              A Message for You
            </h2>
            <p className="max-w-md text-center text-muted-foreground">
              {webData.paragraph}
            </p>
          </div>

          <Card className="w-full bg-pink-100">
            <CardHeader>
              <CardTitle>Birthday wishes for {webData.recipient}</CardTitle>
              <CardDescription>
                Inspiring and heartfelt wishes to celebrate {webData.recipient}'s
                special day.
              </CardDescription>
            </CardHeader>
            <Card className="w-full bg-pink-100">
              <CardContent className="grid gap-6">
                {webData.wishes.map((wish, index) => (
                  <blockquote key={index} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <QuoteIcon className="h-5 w-5 text-primary" />
                      <span>{wish}</span>
                    </div>
                  </blockquote>
                ))}
              </CardContent>
            </Card>
          </Card>

          <Card className="w-full bg-blue-100 text-blue-900">
            <CardHeader>
              <CardTitle>Fun Facts About {webData.recipient}</CardTitle>
              <CardDescription>
                You are ...
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {webData.facts.map((fact, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-blue-100">
                    {/* You can dynamically switch icons here based on the fact type */}
                    {index === 0 && <CakeIcon className="h-6 w-6" />}
                    {index === 1 && <FlowerIcon className="h-6 w-6" />}
                    {index === 2 && <PaletteIcon className="h-6 w-6" />}
                    {index === 3 && <PawPrintIcon className="h-6 w-6" />}
                  </div>
                  <div>
                    <div className="font-medium">{fact}</div>
                    <div className="text-sm text-blue-900/80">
                      {fact.description}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="py-16 bg-purple-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-blue-900">
            Memorable Videos
          </h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
              <div
                key={index}
                className="flex flex-col items-center w-full bg-white rounded-lg shadow-lg"
              >
                <video className="w-full rounded-t-lg" controls>
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Special Moment {index + 1}
                  </h3>
                  <p className="text-sm text-gray-600">
                    A cherished memory from our wonderful journey together.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="surprise" className="py-16 bg-yellow-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-yellow-900">
            A Special Surprise
          </h2>
          <div className="rounded-lg bg-yellow-200 p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-yellow-900">
              Open to see a special surprise!
            </h3>
            <p className="mb-4 text-yellow-800"></p>
            <Button
              href="#"
              className="rounded-md bg-yellow-300 px-4 py-2 text-yellow-900 hover:bg-yellow-400"
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
            <Button
              href="#"
              className="rounded-md bg-yellow-300 px-4 py-2 text-yellow-900 hover:bg-yellow-400 mt-4"
              onClick={handleGenerateDescriptions}
            >
              Generate Cute Photos
            </Button>
            {generatedImages.length > 0 && (
              <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {generatedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Child;