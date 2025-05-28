import OpenAI from "openai";
import * as fs from "fs";
import { getRandomReplyFromCollection } from "./tools";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parseMessage = (completion: any): string => {
  return completion.choices[0].message.content;
};

const getMessageDetails = (query: string) => {
  return `Provide a JSON object like this: 

  "{"mood":"neutral", "hasPolitics":false}" 

  Given the prompt "${query}" make the "mood" key of the JSON object either 'positive', 'neutral', or 'negative'.
  If the prompt includes discussion about politics, make the "hasPolitics" key of the JSON object the boolean value true

  Only choose "negative" if the question is rude, impolite, inconsiderate, or has vulgarity.

  `;
};

const buildPrompt = ({
  query,
  hasPolitics,
  mood,
}: {
  query: string;
  hasPolitics: boolean;
  mood: "positive" | "negative" | "neutral";
}) => {
  let prompt = "";

  if (hasPolitics) {
    prompt +=
      "Respond to this prompt as though you are an angry, vulgar, hardcore libertarian.\n";
  }

  if (mood === "negative") {
    prompt += `you are going to pretend to be Jason.
    Jason is always swearing, using uncensored unmasked strong language, is sarcastic, has caustic wit, and dark humor.
    don't mention Jason. Respond to the following prompt as Jason `;
  }

  prompt += `Respond with only one or two sentences unless otherwise specified in the prompt.\n`;
  prompt += 'Your response should not start with the word "Well".\n';
  prompt += `The prompt is "${query}"`;

  return prompt;
};

export const chatgpt = async ({
  query,
}: {
  query: string;
}): Promise<string | null> => {
  try {
    const messageDetailsResponse = await openai.chat.completions.create({
      messages: [{ role: "user", content: getMessageDetails(query) }],
      model: "gpt-4.1-nano",
    });

    const messageDetails = JSON.parse(parseMessage(messageDetailsResponse));

    const queryCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: buildPrompt({
            query,
            hasPolitics: messageDetails.hasPolitics,
            mood: messageDetails.mood,
          }),
        },
      ],
      model: "gpt-4.1-nano",
    });

    return parseMessage(queryCompletion);
  } catch (error) {
    console.error(error);
    return getRandomReplyFromCollection({ collectionName: "error" });
  }
};

export const dalle = async ({
  query,
}: {
  query: string;
}): Promise<string | Buffer | undefined> => {
  try {
    // Old
    // const openAIImageResponse = await openai.images.generate({
    //   prompt: query,
    //   model: "dall-e-3",
    //   n: 1,
    //   size: "1024x1024",
    // });

    // use this when verified
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: query,
      size: "1024x1024",
      quality: "high",
      n: 1,
    });

    if (result.data) {
      const imageBase64 = result.data[0].b64_json;
      if (!imageBase64) {
        throw new Error("No image data returned");
      }

      const imageBuffer = Buffer.from(imageBase64, "base64");
      // use this to debug
      // fs.writeFileSync("sprite.png", imageBuffer);
      return imageBuffer;
    } else {
      return "nah";
    }
  } catch (error) {
    console.error(error);
    return "No.";
  }
};
