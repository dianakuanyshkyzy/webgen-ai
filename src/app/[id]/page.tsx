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

const GiftCardPage: React.FC = () => {
  const params = useParams();
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) as string; // Ensure id is a string
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
  }, [id]); // Ensure id is in the dependency array

  const renderComponent = () => {
    if (!wishJsonData?.wishData) {
      return null;
    }

    const { componentType } = wishJsonData.wishData.webData;

    switch (componentType) {
      case 'girl':
        return <Girlfriend wishData={wishJsonData.wishData} id={id} />;
      case 'boy':
        return <Boyfriend wishData={wishJsonData.wishData} id={id} />;
      case 'child':
        return <Child wishData={wishJsonData.wishData} id={id} />;
      case 'anniversary':
        return <Anniversary wishData={wishJsonData.wishData} id={id} />;
      case 'thank_you':
        return <ThankYou wishData={wishJsonData.wishData} id={id} />;
      case 'get_well':
        return <GetWell wishData={wishJsonData.wishData} id={id} />;
      case 'invitation':
        return <Invitation wishData={wishJsonData.wishData} id={id} />;
      case 'graduation':
        return <Graduation wishData={wishJsonData.wishData} id={id} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {wishJsonData ? renderComponent() : <div>Loading...</div>}
    </div>
  );
};

export default GiftCardPage;
