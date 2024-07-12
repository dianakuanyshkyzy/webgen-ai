import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

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
  componentType:string;
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
    config: { duration: 2000 }
  });

  return <animated.img src={src} style={props} className="w-full" />;
};

const Girlfriend: React.FC<GirlfriendProps> = ({ wishData, id }) => {
  const {webData} = wishData; 
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
  <div className="flex flex-col bg-stone-100">
    <div className="flex flex-col justify-between items-center px-16 pt-12 pb-4 w-full text-gray-800 bg-stone-100 max-md:px-5 max-md:max-w-full">
      <div className="flex gap-5 justify-between items-center w-full max-w-[1192px] max-md:flex-wrap max-md:max-w-full">
        <div className="flex gap-2 self-stretch my-auto text-2xl font-bold leading-6">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3b971d1759f903a46137417731bd1ee96e5a7fbf532739aaf967ac7b6817c468?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
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
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba5a43fcb79ad8d3576933b7f49acbd2a36d871482760fe106c7fed3811a0bc8?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
            className="shrink-0 mt-32 max-w-full aspect-[0.48] w-[241px] max-md:mt-10"
          />
        </div>
      </div>
    </div>
    <div id="wishes-section" className=" flex justify-center items-center px-16 py-16 w-full bg-stone-100 max-md:px-5 max-md:max-w-full">
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
            {/* <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="grow max-md:mt-10 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                  
                  
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
                    
                    <div className="mt-4 text-3xl font-medium tracking-tight">
                    
                    </div>
                    <div className="mt-4 text-xl leading-8 text-center">
                    </div>
                  </div>
                </div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */}
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
                        <div className="mt-4 text-3xl font-medium tracking-tight">
                          
                        </div>
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

      {/* <div className="flex justify-center items-center px-16 py-16 w-full text-6xl font-bold text-center text-gray-800 bg-stone-100 max-md:px-5 max-md:max-w-full max-md:text-4xl">
        <div className="flex flex-col max-w-full w-[922px] max-md:text-4xl">
          <div className="max-md:max-w-full max-md:text-4xl">
            Thank you for the memories!
          </div>
          <div className="relative mt-16 w-full aspect-[1.79] max-md:mt-10 max-md:max-w-full">
          
          {images.length > 0 ? (
            images.map((image, index) => (
              <WaveImage src={image} key={index} />
              ))
          ) : (
            <p>No images available</p>
          )}
          </div>
        </div>
      </div> */}
            
      <div id="memories-section"className="self-center text-6xl font-bold text-center text-gray-800 w-[922px] max-md:max-w-full max-md:text-4xl mb-10">
            Thank you for the memories!


        </div>
<div className="relative w-full max-w-5xl mx-auto">

      <div
        className="group flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide transition-all duration-300 ease-in-out"
        onMouseEnter={(e) => {
          const carousel = e.currentTarget
          const speed = 0.1
          const handleMouseMove = (e: any) => {
            const { clientX, currentTarget } = e
            const { left, right, width } = currentTarget.getBoundingClientRect()
            const position = (clientX - left) / width
            carousel.scrollLeft +=
              (position < 0.5 ? -1 : 1) * speed * (Math.abs(0.5 - position) * 2) * carousel.scrollWidth
          }
          carousel.addEventListener("mousemove", handleMouseMove)
          return () => {
            carousel.removeEventListener("mousemove", handleMouseMove)
          }
        }}
        onMouseLeave={() => {}}
      >  {images.length > 0 ? (
        images.map((image, index) => (
          <img src={image} key={index} width={600}
          height={400} className="object-cover rounded-lg aspect-video shrink-0 w-full max-w-[400px]"/>
          ))
      ) : (
        <p>No images available</p>
      )} 
      </div>
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>

    <div className="pt-16 pb-10 pl-20 w-full bg-stone-100 max-md:pl-5 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
      <div className="flex flex-col ml-5 w-[21%] max-md:ml-0 max-md:w-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a3dc14860dfe559fe10bf6d4397e732b83d07d3a92f1daa9b5c966c643f54f7c?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
            className="grow shrink-0 mt-16 max-w-full aspect-[0.53] fill-fuchsia-300 w-[249px] max-md:mt-10 transform scaleX-[-1]"
          />
        </div>
        <div id="facts-section"className="flex flex-col w-[79%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col font-bold text-center text-gray-800 max-md:mt-10 max-md:max-w-full">
            <div className="text-6xl max-md:max-w-full max-md:text-4xl">
             {webData.short_paragraph}
            </div>
            <div className="mt-16 text-3xl max-md:mt-10 max-md:max-w-full">
            </div>
            <div className="self-center mt-16 text-xl leading-8 w-[691px] max-md:mt-10 max-md:max-w-full">
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[21%] max-md:ml-0 max-md:w-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a3dc14860dfe559fe10bf6d4397e732b83d07d3a92f1daa9b5c966c643f54f7c?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
            className="grow shrink-0 mt-16 max-w-full aspect-[0.53] fill-fuchsia-300 w-[249px] max-md:mt-10"
          />
        </div>
      </div>
    </div>
    {/* <div className="flex justify-center items-center px-16 py-16 mt-1 w-full bg-stone-100 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col max-w-full w-[1022px]">
        <div className="mx-6 max-md:mr-2.5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[45%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col text-gray-800 max-md:mt-8 max-md:max-w-full">
                <div className="text-4xl font-bold max-md:max-w-full">
                  {webData.recipient} ...
                </div>
                <div className="mt-4 text-xl leading-8 max-md:max-w-full">
                  {webData?.facts[0]}
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[55%] max-md:ml-0 max-md:w-full">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/5b819e1486acc0f6c849899f8d041d07504f393e1950ebede40c7ca77eb100c2?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/5b819e1486acc0f6c849899f8d041d07504f393e1950ebede40c7ca77eb100c2?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/5b819e1486acc0f6c849899f8d041d07504f393e1950ebede40c7ca77eb100c2?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/5b819e1486acc0f6c849899f8d041d07504f393e1950ebede40c7ca77eb100c2?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/5b819e1486acc0f6c849899f8d041d07504f393e1950ebede40c7ca77eb100c2?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/5b819e1486acc0f6c849899f8d041d07504f393e1950ebede40c7ca77eb100c2?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/5b819e1486acc0f6c849899f8d041d07504f393e1950ebede40c7ca77eb100c2?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/5b819e1486acc0f6c849899f8d041d07504f393e1950ebede40c7ca77eb100c2?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="z-10 grow w-full aspect-[1.01] max-md:mt-8 max-md:max-w-full"
              />
            </div>
          </div>
        </div>
        <div className="mt-16 max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/19b42872f9a0870fec3e7022ed5318dfbdddac00553c2145093a2e018985d448?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/19b42872f9a0870fec3e7022ed5318dfbdddac00553c2145093a2e018985d448?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/19b42872f9a0870fec3e7022ed5318dfbdddac00553c2145093a2e018985d448?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/19b42872f9a0870fec3e7022ed5318dfbdddac00553c2145093a2e018985d448?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/19b42872f9a0870fec3e7022ed5318dfbdddac00553c2145093a2e018985d448?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/19b42872f9a0870fec3e7022ed5318dfbdddac00553c2145093a2e018985d448?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/19b42872f9a0870fec3e7022ed5318dfbdddac00553c2145093a2e018985d448?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/19b42872f9a0870fec3e7022ed5318dfbdddac00553c2145093a2e018985d448?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="grow w-full aspect-[1.01] max-md:mt-8 max-md:max-w-full"
              />
            </div>
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col text-gray-800 max-md:mt-8 max-md:max-w-full">
                <div className="text-4xl font-bold max-md:max-w-full">
                {webData.recipient}...
                </div>
                <div className="mt-4 text-xl leading-8 max-md:max-w-full">
                {webData.facts[1]}
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
                {webData.facts[2]}
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/baec528ad9e590ce718e0237733c607dfc6131da093b68e6c327db7cc1dffc31?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/baec528ad9e590ce718e0237733c607dfc6131da093b68e6c327db7cc1dffc31?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/baec528ad9e590ce718e0237733c607dfc6131da093b68e6c327db7cc1dffc31?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/baec528ad9e590ce718e0237733c607dfc6131da093b68e6c327db7cc1dffc31?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/baec528ad9e590ce718e0237733c607dfc6131da093b68e6c327db7cc1dffc31?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/baec528ad9e590ce718e0237733c607dfc6131da093b68e6c327db7cc1dffc31?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/baec528ad9e590ce718e0237733c607dfc6131da093b68e6c327db7cc1dffc31?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/baec528ad9e590ce718e0237733c607dfc6131da093b68e6c327db7cc1dffc31?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="grow w-full aspect-[1.01] max-md:mt-8 max-md:max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-start py-16 pl-20 w-full bg-stone-100 max-md:pl-5 max-md:max-w-full">
      <div className="self-end text-xl leading-8 text-center text-gray-800 max-md:max-w-full">
        Hear from our customers from Top YouTube Channel
      </div>
      <div className="flex gap-4 self-start mt-16 ml-20 text-6xl font-bold text-gray-800 max-md:flex-wrap max-md:mt-10 max-md:text-4xl">
        <div className="max-md:text-4xl">We’ve taught </div>
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/873d66013282aef7ec795271180b7f50b4d495c3f3499a57116f93ee65d877e6?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/873d66013282aef7ec795271180b7f50b4d495c3f3499a57116f93ee65d877e6?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/873d66013282aef7ec795271180b7f50b4d495c3f3499a57116f93ee65d877e6?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/873d66013282aef7ec795271180b7f50b4d495c3f3499a57116f93ee65d877e6?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/873d66013282aef7ec795271180b7f50b4d495c3f3499a57116f93ee65d877e6?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/873d66013282aef7ec795271180b7f50b4d495c3f3499a57116f93ee65d877e6?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/873d66013282aef7ec795271180b7f50b4d495c3f3499a57116f93ee65d877e6?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/873d66013282aef7ec795271180b7f50b4d495c3f3499a57116f93ee65d877e6?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
          className="shrink-0 my-auto w-16 aspect-square"
        />
        <div className="max-md:max-w-full max-md:text-4xl">
          over 3,000 creators
        </div>
      </div>
      <div className="flex gap-3.5 self-start pr-12 ml-20 text-6xl font-bold text-gray-800 max-md:flex-wrap max-md:pr-5 max-md:text-4xl">
        <div className="max-md:text-4xl">how to</div>
        <button
          className="flex justify-center items-center p-2 border border-fuchsia-400 border-solid rounded-[40px] cursor-pointer"
          onClick={handlePrevWish}
        >
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/1a26bcbb909be5f6225c176e27861aef6b85b8da984f3b68335344cb1716bad5?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/1a26bcbb909be5f6225c176e27861aef6b85b8da984f3b68335344cb1716bad5?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1a26bcbb909be5f6225c176e27861aef6b85b8da984f3b68335344cb1716bad5?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/1a26bcbb909be5f6225c176e27861aef6b85b8da984f3b68335344cb1716bad5?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/1a26bcbb909be5f6225c176e27861aef6b85b8da984f3b68335344cb1716bad5?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1a26bcbb909be5f6225c176e27861aef6b85b8da984f3b68335344cb1716bad5?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/1a26bcbb909be5f6225c176e27861aef6b85b8da984f3b68335344cb1716bad5?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/1a26bcbb909be5f6225c176e27861aef6b85b8da984f3b68335344cb1716bad5?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
          className="aspect-[9.09] fill-fuchsia-300 w-[622px] max-md:max-w-full"
        />
        </button>
        <button
          className="flex justify-center items-center p-2 border border-fuchsia-400 border-solid rounded-[40px] cursor-pointer"
          onClick={handlePrevWish}
        >
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/87c3e5d85e783d47e7db62140503a40a31d12b3b57bca1596b65be91b769862b?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/87c3e5d85e783d47e7db62140503a40a31d12b3b57bca1596b65be91b769862b?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/87c3e5d85e783d47e7db62140503a40a31d12b3b57bca1596b65be91b769862b?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/87c3e5d85e783d47e7db62140503a40a31d12b3b57bca1596b65be91b769862b?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/87c3e5d85e783d47e7db62140503a40a31d12b3b57bca1596b65be91b769862b?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/87c3e5d85e783d47e7db62140503a40a31d12b3b57bca1596b65be91b769862b?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/87c3e5d85e783d47e7db62140503a40a31d12b3b57bca1596b65be91b769862b?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/87c3e5d85e783d47e7db62140503a40a31d12b3b57bca1596b65be91b769862b?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
          className="shrink-0 my-auto w-16 aspect-square"
        />
        </button>
      </div>
      <div className="self-end mt-16 text-6xl font-bold text-gray-800 max-md:mt-10 max-md:max-w-full max-md:text-4xl">
        Now we can do it for you
      </div>
      <div className="flex gap-5 justify-between self-end pr-20 mt-16 max-w-full w-[1352px] max-md:flex-wrap max-md:pr-5 max-md:mt-10">
        <div className="text-3xl font-bold text-gray-800">
          See what our famous clients write about us:
        </div>
        <div className="flex gap-4 my-auto">
          <div className="flex justify-center items-center p-2 border border-fuchsia-400 border-solid rounded-[40px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/14bff30e3ff64f2819b1367a58c87adef95827bd2f68c68e0cf4866305713f56?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
              className="w-6 aspect-square"
            />
          </div>
          <div className="flex justify-center items-center p-2 w-10 h-10 bg-fuchsia-400 rounded-[40px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9ef44f9e828acf58677311db4d191809a3b91a401e807c5dd009544425f44267?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
              className="w-6 aspect-square"
            />
          </div>
        </div>
      </div>
      <div className="self-center mt-16 w-full max-w-[1352px] max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[39%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-14 py-6 w-full text-gray-800 bg-fuchsia-300 rounded-2xl max-md:px-5 max-md:mt-8 max-md:max-w-full">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3b7119cc8c224417c1159adad88c2e4ca7d9ec4fa8a75fe21ada52f65e3d049f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3b7119cc8c224417c1159adad88c2e4ca7d9ec4fa8a75fe21ada52f65e3d049f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3b7119cc8c224417c1159adad88c2e4ca7d9ec4fa8a75fe21ada52f65e3d049f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3b7119cc8c224417c1159adad88c2e4ca7d9ec4fa8a75fe21ada52f65e3d049f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3b7119cc8c224417c1159adad88c2e4ca7d9ec4fa8a75fe21ada52f65e3d049f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3b7119cc8c224417c1159adad88c2e4ca7d9ec4fa8a75fe21ada52f65e3d049f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3b7119cc8c224417c1159adad88c2e4ca7d9ec4fa8a75fe21ada52f65e3d049f?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3b7119cc8c224417c1159adad88c2e4ca7d9ec4fa8a75fe21ada52f65e3d049f?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="w-20 aspect-square"
              />
              <div className="mt-4 text-3xl font-medium tracking-tight">
                John Li
              </div>
              <div className="mt-4 text-xl leading-8">
                The Creator innovative ideas, strategic approach, and
                outstanding results have left a lasting impression on me as a
                blogger, making them a standout in the creative industry.
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[39%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-14 py-6 w-full text-gray-800 bg-fuchsia-400 rounded-2xl max-md:px-5 max-md:mt-8 max-md:max-w-full">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/b1fa0da25cc62fb17115934aca120b9f1896d4ee01c972ba6d73b9bceb95857e?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/b1fa0da25cc62fb17115934aca120b9f1896d4ee01c972ba6d73b9bceb95857e?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b1fa0da25cc62fb17115934aca120b9f1896d4ee01c972ba6d73b9bceb95857e?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/b1fa0da25cc62fb17115934aca120b9f1896d4ee01c972ba6d73b9bceb95857e?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/b1fa0da25cc62fb17115934aca120b9f1896d4ee01c972ba6d73b9bceb95857e?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b1fa0da25cc62fb17115934aca120b9f1896d4ee01c972ba6d73b9bceb95857e?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/b1fa0da25cc62fb17115934aca120b9f1896d4ee01c972ba6d73b9bceb95857e?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/b1fa0da25cc62fb17115934aca120b9f1896d4ee01c972ba6d73b9bceb95857e?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="w-20 aspect-square"
              />
              <div className="mt-4 text-3xl font-medium tracking-tight">
                Amanda Steen
              </div>
              <div className="mt-4 text-xl leading-8">
                The Creator innovative ideas, strategic approach, and
                outstanding results have left a lasting impression on me as a
                blogger, making them a standout in the creative industry.
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[21%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow items-start py-6 pl-14 w-full text-gray-800 bg-fuchsia-300 rounded-2xl max-md:mt-8">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/e336cf01f9fb6b63905f6ab38485ed4df3edc8b4328c903fdf7ac6dac4d2ea5a?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/e336cf01f9fb6b63905f6ab38485ed4df3edc8b4328c903fdf7ac6dac4d2ea5a?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e336cf01f9fb6b63905f6ab38485ed4df3edc8b4328c903fdf7ac6dac4d2ea5a?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/e336cf01f9fb6b63905f6ab38485ed4df3edc8b4328c903fdf7ac6dac4d2ea5a?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/e336cf01f9fb6b63905f6ab38485ed4df3edc8b4328c903fdf7ac6dac4d2ea5a?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e336cf01f9fb6b63905f6ab38485ed4df3edc8b4328c903fdf7ac6dac4d2ea5a?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/e336cf01f9fb6b63905f6ab38485ed4df3edc8b4328c903fdf7ac6dac4d2ea5a?apiKey=74627f4a04b34f4c896e1b7417ba3997&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/e336cf01f9fb6b63905f6ab38485ed4df3edc8b4328c903fdf7ac6dac4d2ea5a?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="w-20 aspect-square"
              />
              <div className="mt-4 text-3xl font-medium tracking-tight">
                Nicholas Love
              </div>
              <div className="mt-4 text-xl leading-8">
                The Creator innovative ideas, strategic approach, and
                outstanding results have left a lasting impression on me as a
                blogger, making them a standout in the creative industry.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="self-center mt-16 w-full max-w-[1192px] max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow px-5 pt-14 pb-7 w-full bg-fuchsia-400 rounded-2xl max-md:mt-8 max-md:max-w-full">
            <div className="flex gap-4 max-md:flex-wrap">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d302e6b22ac02839540d7a5b3f9269c9a96b21bed3071c785272c315d409d69?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 aspect-[0.77] w-[92px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7057e96583f67cc7cc1154d801f48c55d043a60ce609f552b59da568dc5701b8?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 max-w-full aspect-square w-[120px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8edae02ce8faa19f5c3ebf7bc14a397b82f176712ce9c286dce75a2e6b7d76e0?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 max-w-full aspect-square w-[120px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/647297ff1c7851e0a0b2eeba193cd4b2bfa4f24a36c30a0f364548a868040977?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 max-w-full aspect-square w-[120px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a236118a57cb978e50cd5331131aba0aaf218bd072212f2cc2410cc1fe0c3507?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 w-16 aspect-[0.53]"
              />
            </div>
            <div className="flex gap-4 mt-4 max-md:flex-wrap">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/05e44ff94151ee36c9ef80abfbcb7191f36019b73fc4867daa689d741f511b75?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 aspect-[0.5] w-[60px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c71c6319db723b154e00296d405d145c5a1fa72c1a9ddbad12385f31decb5d89?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 max-w-full aspect-square w-[120px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/cea8b7d6346962b862529182e2e9dc8aa2f1db2f3606440c5d2fd1367f36cc89?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 max-w-full aspect-square w-[120px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc52fd0304c0606c1c4daad9c3bd26457077e74ac04ddf4634ae1a3def998024?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 max-w-full aspect-square w-[120px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/982ffc5fe4fe6e461cdf97be840735fc6c1ecdb1c3b49a124c0d08fdb48fdf11?apiKey=74627f4a04b34f4c896e1b7417ba3997&"
                className="shrink-0 w-24 aspect-[0.8]"
              />
            </div>
            <div className="self-center mt-7 text-xl leading-8 text-gray-800 w-[412px]">
              We've participated in events for children's education, health
              initiatives, and disaster relief. We're dedicated to ongoing
              involvement and exploring new opportunities.
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow items-start px-14 py-20 w-full text-gray-800 bg-white rounded-2xl max-md:px-5 max-md:mt-8 max-md:max-w-full">
            <div className="text-6xl font-bold max-md:text-4xl">Charity</div>
            <div className="mt-7 text-xl leading-8">
              Our creative agency supports charities globally, using our
              skills in branding, marketing, and social media to make a
              positive impact on local communities and raise awareness about
              important causes.{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-center items-center px-16 py-16 mt-16 w-full max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col w-full max-w-[1192px] max-md:max-w-full">
        <div className="flex flex-col items-center px-16 pt-3 pb-1.5 text-gray-800 max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col max-md:max-w-full">
            <div className="text-6xl font-bold max-md:max-w-full max-md:text-4xl">
              We are waiting for you to contact us
            </div>
            <div className="self-center mt-5 text-xl leading-8 text-center max-md:max-w-full">
              You can write to us at any time and get an instant response.
            </div>
          </div>
        </div>
        

      </div>
      </div> */}
    </div>
  
);
}; 


export default Girlfriend;