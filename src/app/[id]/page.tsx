'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import S3UploadForm from '@/components/S3UploadForm';
import Girlfriend from '@/components/Girlfriend';
import Boyfriend from '@/components/Boyfriend';

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
  characteristics: string[];
  facts: string[];
  senders: string;
  componentType: string;
}

const GiftCardPage: React.FC = () => {
  const { id } = useParams();
  const [wishJsonData, setWishJsonData] = useState<{ wishData?: WishData } | null>(null);

  useEffect(() => {
    console.log('Current ID:', id); // Log the ID value

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
        <>
          {wishJsonData.wishData.webData?.componentType === 'girl' ? (
            <Girlfriend wishData={wishJsonData.wishData} id={id} />
          ) : wishJsonData.wishData.webData?.componentType === 'boy' ? (
            <Boyfriend wishData={wishJsonData.wishData} id={id} />
          ) : (
            <div>Component type not recognized</div>
          )}
          <S3UploadForm onUpload={(file) => console.log('Uploaded file:', file)} id={id} />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GiftCardPage;
