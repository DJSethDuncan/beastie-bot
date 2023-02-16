const tools = require("./tools");
const openai = require("./openai");
const config = require("./config");

module.exports = {
  async botHandler(discordMessageContent) {
    const botMessageFirstWord = tools.getFirstWordLowercase(
      discordMessageContent
    );

    let response = "";
    if (discordMessageContent == "help") {
      response = config.helpText;
    } else {
      switch (botMessageFirstWord) {
        case "image":
          response = await openai.dalle(
            tools.removeFirstWord(discordMessageContent)
          );
          break;
        case "dumbly":
          response = await openai.chatgpt({
            query: discordMessageContent,
            model: "ada",
          });
        case "smartly":
          response = await openai.chatgpt({
            query: discordMessageContent,
            model: "davinci",
          });
          break;
        default:
          response = await openai.chatgpt({
            query: discordMessageContent,
          });
          break;
      }
    }

    return response;
  },
  genericHandler(discordMessageContent) {
    if (
      tools.hasWordInWordList({
        messageContent: discordMessageContent,
        wordList: "beastie",
      })
    ) {
      return tools.beastieBoysify(discordMessageContent);
    }
  },
};
