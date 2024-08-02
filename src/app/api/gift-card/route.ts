import prisma from "@/lib/db";
import askGpt from "@/lib/openai";

export const maxDuration = 60;
// max up to 60 secs

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const context = formData.get("context")?.toString();

    if (!context) {
      return new Response(
        JSON.stringify({ error: "Missing context parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `You are the most professional gift text generator, your words always make people cry.
     You are very close to the recipient, so the response should be informal and sincere, human-like, very personalized based on provided information. Do not repeat youself in any of the responses. Always write different responses for the JSON file categories.  
     You are so in love with the person you are writing the giftcard for. 
     Generate a birthday gift card text with the following context: ${context}. 
     Generate the the output of the format of the following example JSON: 
    {
    "webData": {
    "title": "For my dearest mom", //in accordance with the event. can be "Congratulations on the graduation, Jason" or "Happy 5th anniversary, Jason & Emma!"
    "recipient": "mom",
    "about": "On this wonderful day, the sun was born. Our mom, the most beautiful light of our lives, is the most caring and bright person in this world. We want you to shine as bright as the sun today and always. Happy birthday, mom!",
    "paragraph": "Happiest birthday! We love you so much and we are so grateful for everything you do for us. You are the best mom in the world and we are so lucky to have you. We hope you have the most amazing day and that all your dreams come true. We love you!",
    "short_paragraph":"Mom has always been a light soul. Once, she told me that she was born on the day the sun was born. I believe her. She is the most caring and bright person in this world. I want her to shine as bright as the sun today and always. Happy birthday, mom!", 
    "quotes": [
      "I love you mom - from your son",
      "You are the best mom in the world - from your daughter",
      "You are my everything - from your son",
    ],
    "eventDate": "2024-12-31", // identify the date of the event 
    "facts": [
      "Your eyes lighten when you see an ice cream",
      "Every time you see a dog, you smile",
      "You dream of being a singer",
    ],
    hobbies: ["gardening - you really like gardening and bringing the plants to life! I love that in you. You always bring light and blah blah blah...", "reading- your passion for reading amazes me. balh blah blah..."], // create hobbies array with the detailed descrition of a person's interest based on the prompt. 
    "wishes": ["Happy Birthday! Wishing you a day filled with joy, laughter, and love. May all your dreams come true and your year ahead be as amazing as you are. Celebrate today and always, knowing how much you are cherished and appreciated. Here's to another year of incredible adventures and wonderful memories. Happy birthday!", "Joyous Birthday! May your special day be filled with everything you love most. I'm grateful for all the moments we've shared and look forward to making many more memories together. You deserve all the happiness in the world. Enjoy every moment of your birthday, surrounded by those who care for you. Cheers to you!","Happy Birthday! Today is a celebration of you and all the amazing things you bring into the world. May your day be as wonderful and inspiring as you are. Wishing you endless joy, good health, and success in all your endeavors. Have a fantastic birthday and a year ahead that's even better!"," Birthday Wishes! On your special day, I want to wish you all the happiness your heart can hold. May your life be filled with love, joy, and countless blessings. You are a truly wonderful person, and I hope this year brings you everything you've been hoping for. Have a brilliant birthday!"],  
    "senders" : " The Johnson Family. Sending love from San Francisco", 
    "facts":["Your eyes always lighten when you see an ice cream", "You always are smiling at dogs and cats", "Your dream is to be a singer"], 
    "componentType":"girl"; //or a "boy", "anniversary", "child", "graduation", "invitation", "thank_you", "get_well" - Just 8 options!, - do not create new component types. the only types are the ones I listed. remember there is no component like "birthday", if I type mom, the component should be "girl". PLEASE DO NOT MESS UP THIS COMPONENT OF JSON. IT IS THE MOST IMPORTANT COMPONENT. YOU SHOULD ALWAYS REMEMBER ABOUT componentType., 
    "poemabout": "  
                As the years have passed, our love has grown,
                A bond that's stronger than any stone.
                Through laughter and tears, we've weathered it all,
                And in each other's arms, we stand tall.
                Today, we celebrate the life we've built,
                A testament to the love we've instilled.
                May our journey continue, hand in hand,
                Forever united, a steadfast stand.
                Happy anniversary, my love, my friend", //create a poem about the person you are writing the gift card for. Include the reason of the celebration.
    "description": "mom, turning 40, gardening, cooking, birthday, dogs, ..." //a short description in under 150 characters. Will be used to generate a song based on this JSON category. also include the style of the song based on the user prompt - be super creative! 
  }

}  Generate a JSON file. 
     `;
    const gptResponse = await askGpt(prompt);

    if (!gptResponse) {
      throw new Error("Failed to generate response from GPT");
    }

    console.log("GPT response:", gptResponse);
    const { id } = await prisma.wish.create({
      data: {
        wishData: JSON.parse(gptResponse),
      },
    });

    return new Response(
      JSON.stringify({
        url: `${request.headers.get("origin")}/${id}`,
        id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
