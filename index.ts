import * as dotenv from "dotenv";
dotenv.config();
import * as Discord from "discord.js";
const client = new Discord.Client();
import * as Sentry from "@sentry/node";
import { processMessage } from "./bin/processMessage";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

client.once("ready", (): void => {
  console.log("BeastieBot is about to drop");
});

client.on("message", async (messagePayload: any): Promise<void> => {
  try {
    const response = await processMessage(messagePayload);
    if (process.env.ENVIRONMENT === "prod") {
      response ? messagePayload.channel.send(response) : null;
    } else {
      console.log("DEV Bot Response: ", response);
    }
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.TOKEN);
