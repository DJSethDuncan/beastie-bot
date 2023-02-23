import {
  getFirstWordLowercase,
  removeFirstWord,
  getRandomReplyFromCollection,
  hasWordInWordCollection,
  beastieBoysify,
} from "./tools";
import { chatgpt, dalle } from "./openai";
import { config } from "./config";

let lastMessageTime: number = Date.now();

export interface BotHandlerProps {
  message: string;
}

interface GenericHandlerProps {
  message: string;
}

export const botHandler = async ({
  message,
}: BotHandlerProps): Promise<string> => {
  const botMessageFirstWord = getFirstWordLowercase({ text: message });
  let response: string = "";
  if (message == "help") {
    response = config.helpText;
  } else {
    let thisMessageTime: number = Date.now();
    if (thisMessageTime - lastMessageTime < 10000) {
      response = getRandomReplyFromCollection({ collectionName: "rateLimit" });
    } else {
      lastMessageTime = Date.now();
      switch (botMessageFirstWord) {
        case "image":
          response = await dalle({ query: removeFirstWord({ text: message }) });
          break;
        case "dumbly":
          response = await chatgpt({
            query: message,
            model: "ada",
          });
        case "smartly":
          response = await chatgpt({
            query: message,
            model: "davinci",
          });
          break;
        default:
          response = await chatgpt({
            query: message,
          });
          break;
      }
    }
  }

  return response;
};

export const genericHandler = ({ message }: GenericHandlerProps) => {
  if (
    hasWordInWordCollection({
      messageContent: message,
      wordCollectionName: "beastie",
    })
  ) {
    return beastieBoysify({ text: message });
  } else {
    return "";
  }
};
