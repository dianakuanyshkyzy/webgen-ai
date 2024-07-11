import prisma from '@/lib/db';
import askGpt from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const context = formData.get('context')?.toString();
    
    if (!context) {
      return new Response(JSON.stringify({ error: 'Missing context parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are the most professional gift text generator, your words always make people cry.
     You are very close to the recipient, so the response should be informal and sincere, human-like. 
     You are so in love with the person you are writing the giftcard for. 
     Generate a birthday gift card text with the following context: ${context}. 
     Generate the the output of the format of the following example JSON: 
    {
  "webData": {
    "title": "For my dearest mom",
    "recipient": "mom",
    "about": "On this wonderful day, the sun was born. Our mom, the most beautiful light of our lives, is the most caring and bright person in this world. We want you to shine as bright as the sun today and always. Happy birthday, mom!",
    "paragraph": "Happiest birthday! We love you so much and we are so grateful for everything you do for us. You are the best mom in the world and we are so lucky to have you. We hope you have the most amazing day and that all your dreams come true. We love you!",
    
    "quotes": [
      "I love you mom - from your son",
      "You are the best mom in the world - from your daughter",
      "You are my everything - from your son",
    ],
    hobbies: ["gardening", "reading", "cooking", "traveling"],
    "wishes": ["Happy Birthday!
Wishing you a day filled with joy, laughter, and love. May all your dreams come true and your year ahead be as amazing as you are. Celebrate today and always, knowing how much you are cherished and appreciated. Here's to another year of incredible adventures and wonderful memories. Happy birthday!
",

        "
Joyous Birthday!
May your special day be filled with everything you love most. I'm grateful for all the moments we've shared and look forward to making many more memories together. You deserve all the happiness in the world. Enjoy every moment of your birthday, surrounded by those who care for you. Cheers to you!
"

        "
Happy Birthday!
Today is a celebration of you and all the amazing things you bring into the world. May your day be as wonderful and inspiring as you are. Wishing you endless joy, good health, and success in all your endeavors. Have a fantastic birthday and a year ahead that's even better!
"

        "
Birthday Wishes!
On your special day, I want to wish you all the happiness your heart can hold. May your life be filled with love, joy, and countless blessings. You are a truly wonderful person, and I hope this year brings you everything you've been hoping for. Have a brilliant birthday!
"], //generate 10 wishes. they all should be very heartfelt and human-like. 
    "senders" : "
The Johnson Family
Sending love from San Francisco"
  }
}  Generate a JSON file. 
     `;
    const gptResponse = await askGpt(prompt);

    if (!gptResponse) {
      throw new Error('Failed to generate response from GPT');
    }

    console.log('GPT response:', gptResponse); 
      const { id } = await prisma.wish.create({
      data: {
        wishData: JSON.parse(gptResponse),
      },
    });

    return new Response(
      JSON.stringify({ url: `http://localhost:3000/${id}`, id}),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// import prisma from '@/lib/db';
// import askGpt from '@/lib/openai';
// import axios from 'axios';

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// const DALL_E_API_URL = 'https://api.openai.com/v1/images/generations';

// async function generateImage(prompt) {
//   try {
//     const response = await axios.post(
//       DALL_E_API_URL,
//       {
//         prompt: prompt,
//         n: 1,
//         size: '1024x1024',
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//         },
//       }
//     );

//     return response.data.data[0].url;
//   } catch (error) {
//     console.error('Error generating image:', error);
//     throw error;
//   }
// }

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const context = formData.get('context')?.toString();
    
//     if (!context) {
//       return new Response(JSON.stringify({ error: 'Missing context parameter' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const prompt = `You are the most professional gift text generator, your words always make people cry.
//      You are very close to the recipient, so the response should be informal and sincere, human-like. 
//      You are so in love with the person you are writing the giftcard for. 
//      Generate a birthday gift card text with the following context: ${context}. 
//      Generate the output of the format of the following example JSON: 
//     {
//       "webData": {
//         "title": "For my dearest mom",
//         "recipient": "mom",
//         "about": "On this wonderful day, the sun was born. Our mom, the most beautiful light of our lives, is the most caring and bright person in this world. We want you to shine as bright as the sun today and always. Happy birthday, mom!",
//         "paragraph": "Happiest birthday! We love you so much and we are so grateful for everything you do for us. You are the best mom in the world and we are so lucky to have you. We hope you have the most amazing day and that all your dreams come true. We love you!",
//         "quotes": [
//           "I love you mom - from your son",
//           "You are the best mom in the world - from your daughter",
//           "You are my everything - from your son",
//         ],
//         hobbies: ["gardening", "reading", "cooking", "traveling"],
//         "wishes": [
//           { "title":"amazing", "text": "May your birthday be as wonderful and amazing as you are.", "image": "GENERATED IMAGE BY GPT" },
//           { title":"dreams","text": "I hope all your dreams come true today and always.", "image": "GENERATED IMAGE BY GPT" },
//           { title":"love", "text": "Wishing you a day filled with love, joy, and all your favorite things.", "image": "GENERATED IMAGE BY GPT" },
//           { title":"amazing", "text": "Happy Birthday to the person who means the world to me.", "image": "GENERATED IMAGE BY GPT" }
//         ],
//         "senders": "The Johnson Family\nSending love from San Francisco"
//       }
//     } Generate a JSON file.`;
    
//     const gptResponse = await askGpt(prompt);

//     if (!gptResponse) {
//       throw new Error('Failed to generate response from GPT');
//     }

//     console.log('GPT response:', gptResponse); 

//     // Parse the GPT response and replace placeholder text with generated images
//     const gptData = JSON.parse(gptResponse);
//     const wishesWithImages = await Promise.all(
//       gptData.webData.wishes.map(async (wish) => {
//         const imageUrl = await generateImage(wish.text);
//         return { ...wish, image: imageUrl };
//       })
//     );
    
//     gptData.webData.wishes = wishesWithImages;

//     const { id } = await prisma.wish.create({
//       data: {
//         wishData: gptData,
//       },
//     });

//     return new Response(
//       JSON.stringify({ url: `http://localhost:3000/${id}`, id }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     console.error('Server error:', error);
//     return new Response(
//       JSON.stringify({ error: error.message || 'Server error' }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }
