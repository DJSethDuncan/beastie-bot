import {
  getFirstWordLowercase,
  getRandomReplyFromCollection,
  hasWordInWordCollection,
  beastieBoysify,
} from "./tools";
import { text } from "./openai";
import { config } from "./config";
import type { BotHandlerProps, GenericHandlerProps } from "../types";

let lastMessageTime: number = Date.now();

export const botHandler = async ({
  message,
  author,
}: BotHandlerProps): Promise<string | undefined> => {
  let response;
  if (message == "help") {
    response = config.helpText;
  } else {
    let thisMessageTime: number = Date.now();
    if (
      thisMessageTime - lastMessageTime < 10000 &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      response = getRandomReplyFromCollection({ collectionName: "rateLimit" });
    } else {
      lastMessageTime = Date.now();
      response = await text({
        query: message,
        author,
      });
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
