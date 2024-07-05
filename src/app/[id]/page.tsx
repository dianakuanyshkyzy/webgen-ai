'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DadHomePage from '@/components/DadHomePage'; // Adjust the import path as necessary

interface WishData {
  title: string;
  about: string;
  paragraph: string;
  images: string[];
  quotes: string[];
  videos: string[];
  wishes: string[];
  hobbies: string[];
  short_paragraph: string;
  senders: string;
}

const GiftCardPage: React.FC = () => {
  const { id } = useParams();
  const [wishJsonData, setWishJsonData] = useState<{ wishData?: WishData } | null>(null);

  useEffect(() => {
    const fetchWishData = async () => {
      try {
        const response = await axios.get(`/api/wishes?id=${id}`);
        console.log('Fetched wish data:', response.data); // Log the fetched data
        setWishJsonData(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchWishData();
  }, [id]);

  return (
    <div>
      {wishJsonData ? (
        <DadHomePage wishData ={wishJsonData.wishData} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GiftCardPage;
