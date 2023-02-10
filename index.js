const dotenv = require("dotenv");
dotenv.config();
const Discord = require("discord.js");
const client = new Discord.Client();
const Message = require("./bin/message");

client.once("ready", () => {
  console.log("BeastieBot is about to drop");
});

client.on("message", (messagePayload) => {
  const { response } = Message.processMessage(messagePayload);
  if (response) messagePayload.channel.send(response);
});

client.login(process.env.TOKEN);
