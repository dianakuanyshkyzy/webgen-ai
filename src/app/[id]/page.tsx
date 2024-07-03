'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const GiftCardPage = () => {
  const { id } = useParams();
  const [wishJsonData, setWishJsonData] = useState({});

  useEffect(() => {
    const fetchWishData = async () => {
      try {
        const response = await axios.get(`/api/wishes?id=${id}`);
        setWishJsonData(response.data);
      } catch (error: any) {
        console.error('Error:', error);
      }
    };
    fetchWishData();
  }, [id]);

  return (
    <div>
      This is the gift card page for gift card with id {id} with wish data{' '}
      {JSON.stringify(wishJsonData)}
    </div>
  );
};

export default GiftCardPage;
