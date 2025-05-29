import OpenAI from "openai";
import * as fs from "fs";
import { getRandomReplyFromCollection } from "./tools";
import { getMessages } from "./messageLogger";

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
  author,
}: {
  query: string;
  hasPolitics: boolean;
  mood: "positive" | "negative" | "neutral";
  author: {
    id: string;
  };
}) => {

  // Load conversation history from message log
  const conversationHistory = getMessages();

  let prompt = "";

  // add context
  prompt += `You have full context of the user’s preferences, interests, and past conversations as if you remember them naturally, like a person with perfect memory.
Never reference how you know this information.
Do not say things like “based on your previous messages,” “you mentioned,” “as you said before,” or anything that implies you're retrieving or recalling conversation history.
Simply incorporate the relevant information naturally into your responses, as if it’s common knowledge or intuitive context you understand about the user.`;

  prompt += "Use the following conversation history as context to respond to the request. If there is anything relevant, include a reference to the content. If there is nothing relevant, ignore the history.";
  prompt += "Specifically look for messages matching the user ID " + author.id + ".";
  prompt += "Conversation history starts here: " + JSON.stringify(conversationHistory) + " --- Conversation history ends here.";
  
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

export const text = async ({
  query,
  author,
}: {
  query: string;
  author: {
    id: string;
  };
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
            author,
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