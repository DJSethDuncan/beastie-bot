const dotenv = require("dotenv");
dotenv.config();
const Discord = require("discord.js");
const client = new Discord.Client();
const Message = require("./bin/message");

client.once("ready", () => {
  console.log("BeastieBot is about to drop");
});

client.on("message", async (messagePayload) => {
  const { response } = await Message.processMessage(messagePayload);
  console.log("response", response.keys);
  if (response) messagePayload.channel.send(response);
});

client.login(process.env.TOKEN);
