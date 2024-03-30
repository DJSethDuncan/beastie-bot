import * as dotenv from "dotenv";
dotenv.config();
import * as Discord from "discord.js";
const client = new Discord.Client();
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { processMessage } from "./bin/processMessage";

Sentry.init({
  dsn: "https://cf0fc945bcac2d5808c37c2181fa3ce5@o4506998133620736.ingest.us.sentry.io/4506998137290752",
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
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
