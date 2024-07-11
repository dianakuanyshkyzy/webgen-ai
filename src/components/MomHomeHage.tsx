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


  useEffect(() => {
    party.confetti(document.body, {
      count: party.variation.range(100, 200),
    });
  }, []);

  return (
    <>
      <head>
        <title>PartyPals</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/party-js/1.0.0/party.min.js"></script>
      </head>
      <body className="font-sans bg-orange-200 text-brown-800">
        <div className="confetti"></div>
        <div className="party-pals">
          <header className="header flex justify-between items-center p-4 bg-white border-b border-orange-100">
            <div className="logo text-2xl font-bold">PartyPals</div>
            <nav className="nav space-x-4">
              <a href="#welcome" className="text-brown-800 no-underline">Welcome</a>
              <a href="#fun-memories" className="text-brown-800 no-underline">Fun Memories</a>
              <a href="#celebrate" className="text-brown-800 no-underline">Celebrate</a>
            </nav>
          </header>

          <section id="welcome" className="hero text-center py-20 text-white" style={{ backgroundColor: '#f90' }}>
            <h1 className="text-4xl">Welcome to PartyPals!</h1>
            <p>Join us in celebrating the most amazing birthday bash ever!</p>
            <div className="party-started bg-white text-brown-800 p-8 rounded-lg m-auto max-w-xl mt-8">
              <h2 className="text-3xl">Let's Get This Party Started!</h2>
              <p>At PartyPals, we make every celebration unforgettable. Whether it's a surprise party, a themed event, or just a casual gathering, we've got you covered with fun activities and unforgettable memories.</p>
              <div className="images flex justify-center gap-8 mt-8">
                <img src="/balloons.png" alt="Balloons" className="w-24 h-24" />
                <img src="/confetti.png" alt="Confetti" className="w-24 h-24" />
              </div>
            </div>
          </section>

          <section id="fun-memories" className="fun-memories py-8 text-center">
            <h2 className="text-3xl">Fun Memories</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                { src: '/memory1.jpg', text: 'When you try to blow out the candles and end up in a cake fight!' },
                { src: '/memory2.jpg', text: 'Even Buddy wanted a slice of the action!' },
                { src: '/memory3.jpg', text: 'Musical chairs got intense real quick!' },
                { src: '/memory4.jpg', text: 'When the theme is "anything goes"!' },
                { src: '/memory5.jpg', text: 'Icing is for faces too, right?' },
                { src: '/memory6.jpg', text: 'Bonfire tales and roasted marshmallows!' },
              ].map((memory, index) => (
                <div key={index} className="memory bg-white border border-orange-100 rounded-lg p-4">
                  <img src={memory.src} alt={`Memory ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                  <p className="mt-2">{memory.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="celebrate" className="celebrate py-8 text-center bg-orange-500 text-white">
            <h2 className="text-3xl">Celebrate with PartyPals!</h2>
            <div className="leave-wish bg-white text-brown-800 p-8 rounded-lg m-auto max-w-xl mt-8">
              <h3 className="text-2xl">Leave Your Birthday Wish</h3>
              <form className="flex flex-col gap-4 mt-4">
                <input type="text" name="name" placeholder="Your Name" className="p-2 border border-orange-100 rounded-lg text-black" />
                <textarea name="message" placeholder="Your Message" className="p-2 border border-orange-100 rounded-lg text-black"></textarea>
                <button type="submit" className="bg-orange-500 text-white p-2 rounded-lg">Post Message</button>
              </form>
            </div>
            <div className="birthday-wishes bg-white text-brown-800 p-8 rounded-lg m-auto max-w-xl mt-8">
              <h3 className="text-2xl">Birthday Wishes</h3>
              <ul className="list-none p-0 text-black">
                {[
                  'Happy Birthday, Sarah! Wishing you a day filled with love and joy. - Mike',
                  'Have a fantastic birthday, Emily! May your year be as amazing as you are. - Jessica',
                  'Wishing you all the best on your special day, John! - Alex',
                  'Happy Birthday, Olivia! Hope your day is filled with fun and laughter. - Emma',
                  'Cheers to another year of greatness, Liani! - Noah',
                ].map((wish, index) => (
                  <li key={index} className="bg-gray-50 border border-orange-100 rounded-lg p-4 my-2">
                    {wish}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </body>
    </>
  );
};

export default MomHomePage;
