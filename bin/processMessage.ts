import { botHandler, genericHandler } from "./handlers";
import { sarcasm, getFirstWordLowercase, removeFirstWord } from "./tools";
import { config } from "./config";
import { logMessage as logMessageToFile } from "./messageLogger";
import type { MessagePayloadType, TriggerWordHandlerType } from "../types";

export const processMessage = async (
  messagePayload: MessagePayloadType
): Promise<string | undefined> => {
  const { channel, author, content }: MessagePayloadType = messagePayload;

  const triggerWordHandler: TriggerWordHandlerType = {
    bot: botHandler,
  };

  if (config.ignoreUsers.includes(author.id)) return undefined;

  logMessage(messagePayload);

  // if (channel.type === "dm" || config.beSarcasticToUsers.includes(author.id))
  //   return sarcasm({ text: content });

  const messageFirstWord = getFirstWordLowercase({ text: content });

  const response = Object.keys(triggerWordHandler).includes(messageFirstWord)
    ? await triggerWordHandler[messageFirstWord]({
        message: removeFirstWord({ text: content }),
        author,
      })
    : genericHandler({ message: content });
  
  return response;
};

const logMessage = ({ author, channel, content }: MessagePayloadType): void => {
  logMessageToFile({ author, channel, content });
  console.log(
    `New message from ${author.username} (author.id: ${author.id})`
  );
};
