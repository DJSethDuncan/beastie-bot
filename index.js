const dotenv = require("dotenv");
dotenv.config();
const Discord = require("discord.js");
const client = new Discord.Client();
const handlers = require("./bin/handlers");
const tools = require("./bin/tools");
const config = require("./bin/config");

/*
  this object holds trigger words and their respective handlers
  handler functions should go in the ./bin/handlers file

  ex: { triggerWord: handlerFunction }
*/

const triggerWordHandler = {
  bot: handlers.botHandler,
};

client.once("ready", () => {
  console.log("BeastieBot is about to drop");
});

client.on("message", async (messagePayload) => {
  try {
    const { channel, author, content } = messagePayload;
    let response = "";

    if (config.ignoreUsers.includes(author.id)) return null;

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
      response = tools.sarcasm(content);
    } else {
      // Handle channel message
      const messageFirstWord = tools.getFirstWordLowercase(content);
      // check if the first word of the message matches a key in the triggerWordHandler object
      if (Object.keys(triggerWordHandler).includes(messageFirstWord)) {
        const processMessage = triggerWordHandler[messageFirstWord];
        response = await processMessage(tools.removeFirstWord(content));
      } else {
        // default to generic message parsing
        response = await handlers.genericHandler(content);
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
