const tools = require("./tools");
const openai = require("./openai");

module.exports = {
  async botHandler(discordMessageContent) {
    const botMessageFirstWord = tools.getFirstWordLowercase(
      discordMessageContent
    );

    switch (botMessageFirstWord) {
      case "image":
        const dalleResponse = await openai.dalle(
          tools.removeFirstWord(discordMessageContent)
        );
        return dalleResponse;
        break;
      default:
        const chatgptResponse = await openai.chatgpt({
          query: discordMessageContent,
        });
        return chatgptResponse;
        break;
    }
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
