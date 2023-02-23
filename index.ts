import * as dotenv from "dotenv";
dotenv.config();
import * as Discord from "discord.js";
const client = new Discord.Client();
import { botHandler, genericHandler } from "./bin/handlers";
import { sarcasm, getFirstWordLowercase, removeFirstWord } from "./bin/tools";
import { config } from "./bin/config";

import type { BotHandlerProps } from "./bin/handlers";

interface TriggerWordHandlerType {
  [key: string]: ({ message }: BotHandlerProps) => Promise<string>;
}

interface MessagePayloadType {
  channel: {
    name: string;
    type: string;
  };
  author: {
    username: string;
    id: string;
  };
  content: string;
}

/*
  this object holds trigger words and their respective handlers
  handler functions should go in the ./bin/handlers file

  ex: { triggerWord: handlerFunction }
*/

const triggerWordHandler: TriggerWordHandlerType = {
  bot: botHandler,
};

client.once("ready", (): void => {
  console.log("BeastieBot is about to drop");
});

client.on("message", async (messagePayload: any): Promise<void> => {
  try {
    const { channel, author, content }: MessagePayloadType = messagePayload;
    let response = "";

    if (config.ignoreUsers.includes(author.id)) return;

    console.log(
      `New message from ${author.username} (author.id: ${
        author.id
      }) (channel: ${channel.name ?? "DM"}): ${content}`
    );

    if (
      channel.type === "dm" ||
      config.beSarcasticToUsers.includes(author.id)
    ) {
      // Handle direct message
      response = sarcasm({ text: content });
    } else {
      // Handle channel message
      const messageFirstWord = getFirstWordLowercase({ text: content });
      // check if the first word of the message matches a key in the triggerWordHandler object
      if (Object.keys(triggerWordHandler).includes(messageFirstWord)) {
        const processMessage = triggerWordHandler[messageFirstWord];
        response = await processMessage({
          message: removeFirstWord({ text: content }),
        });
      } else {
        // default to generic message parsing
        response = genericHandler({ message: content });
      }
    }

    if (response && process.env.ENVIRONMENT === "prod") {
      messagePayload.channel.send(response);
    } else {
      console.log("DEV Bot Response: ", response);
    }
  } catch (error) {
    // error
    console.error(error);
  }
});

client.login(process.env.TOKEN);
