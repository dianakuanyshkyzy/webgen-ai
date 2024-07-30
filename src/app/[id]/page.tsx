'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import S3UploadForm from '@/components/S3UploadForm';
import Girlfriend from '@/components/Girl';
import Boyfriend from '@/components/Boy';
import Child from '@/components/Child';
import Anniversary from '@/components/Anniversary';
import ThankYou from '@/components/Thankyou';
import GetWell from '@/components/GetWell';
import Invitation from '@/components/Invitation';
import Graduation from '@/components/Graduation';
interface WishData {
  webData:{
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
}
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
          {wishJsonData.wishData?.webData?.componentType === 'girl' ? (
            <Girlfriend wishData={wishJsonData.wishData} id={id} />
          ) : wishJsonData.wishData?.webData?.componentType === 'boy' ? (
            <Boyfriend wishData={wishJsonData.wishData} id={id} />
          ) : wishJsonData.wishData?.webData?.componentType === 'child' ? (
            <Child wishData={wishJsonData.wishData} id={id} />
          ): wishJsonData.wishData?.webData?.componentType === 'anniversary' ? (
            <Anniversary wishData={wishJsonData.wishData} id={id} />
          ):wishJsonData.wishData?.webData?.componentType === 'thank_you' ? (
            <ThankYou wishData={wishJsonData.wishData} id={id} />
          ):
          wishJsonData.wishData?.webData?.componentType === 'get_well' ? (
            <GetWell wishData={wishJsonData.wishData} id={id} />
          ):
          wishJsonData.wishData?.webData?.componentType === 'invitation' ? (
            <Invitation wishData={wishJsonData.wishData} id={id} />
          ):
          wishJsonData.wishData?.webData?.componentType === 'graduation' ? (
            <Graduation wishData={wishJsonData.wishData} id={id} />
          ):
           null}
        </>
      ) : (
        <div>Loading...</div>
      )} 
    </div>
  );
};

export default GiftCardPage;