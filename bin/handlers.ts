import {
  getFirstWordLowercase,
  removeFirstWord,
  getRandomReplyFromCollection,
  hasWordInWordCollection,
  beastieBoysify,
} from "./tools";
import { chatgpt, dalle } from "./openai";
import { config } from "./config";
import type { BotHandlerProps, GenericHandlerProps } from "../types";

let lastMessageTime: number = Date.now();

export const botHandler = async ({
  message,
}: BotHandlerProps): Promise<string | undefined> => {
  const botMessageFirstWord = getFirstWordLowercase({ text: message });
  let response;
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

  return response || undefined;
};

export const genericHandler = ({ message }: GenericHandlerProps): string => {
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
