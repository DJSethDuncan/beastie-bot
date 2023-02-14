// import { Configuration, OpenAIApi } from "openai";
const OpenAI = require("openai");
const configuration = new OpenAI.Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAI.OpenAIApi(configuration);
const Tools = require("./tools");

const wordLists = {
  beastie: [
    "beastie boys",
    "beastie",
    "intergalactic",
    "planetary",
    "sabotage",
    "fight",
  ],
};

module.exports = {
  async processMessage(message) {
    try {
      const action = {
        response: "",
      };

      const { channel, author, content } = message;
      const botMessage = Tools.nthWordIs({ string: content, firstWord: "bot" })
        ? Tools.removeFirstWord(content)
        : null;

      // ignore bot messages
      if (author.id === "804419214894301227") {
        return action;
      }

      // log message
      console.log(
        `New message from ${author.username} (channel: ${
          channel.name ?? "DM"
        }): ${content}`
      );
      if (botMessage) {
        const isImageMessage = Tools.nthWordIs({
          string: content,
          firstWord: "image",
          n: 1,
        });

        if (isImageMessage) {
          const imageContent = content.split(" ").slice(1).join(" ");
          const openAIImageResponse = await openai.createImage({
            prompt: imageContent,
            n: 1,
            size: "512x512",
          });
          action.response = openAIImageResponse.data.data[0].url;
        } else {
          const openAIresponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: botMessage,
            max_tokens: 500,
            temperature: 0.8,
          });
          // console.log("openAIresponse: ", openAIresponse.data.choices);
          action.response = openAIresponse.data.choices[0].text;
        }
      } else {
        // beastie bot reply
        if (
          Tools.hasWordInList({
            messageContent: content,
            wordList: wordLists.beastie,
          })
        ) {
          action.response = this.beastieBoysify(content);
        }

        // Handle DM reply
        if (channel.type === "dm") {
          action.response = this.sarcasm(content);
        }
      }

      // return
      return action;
    } catch (e) {
      console.error("There was a problem processing this message.");
      console.error(e);
    }
  },
  beastieBoysify(text) {
    const capitalizeRand = Tools.getRandomInt({ min: 3, max: 10 });
    const exclamationPointsRand = Tools.getRandomInt({ min: 0, max: 10 });
    const messageArray = text.split(" ");
    let beastieReply = messageArray[messageArray.length - 1];
    let exclamationPoints = "";
    for (i = 1; i <= exclamationPointsRand; i++) {
      exclamationPoints += "!";
    }
    // capitalize
    if (capitalizeRand > 5) {
      beastieReply = this.moreVowels(beastieReply);
      beastieReply = beastieReply.toUpperCase();
    }
    // strip non alphanum
    beastieReply = beastieReply.replace(/\W/g, "");
    // add exclamation points
    beastieReply += exclamationPoints;
    return beastieReply;
  },
  sarcasm(text) {
    return text
      .split("")
      .map((item, index) =>
        index % 2 === 1 ? item.toUpperCase() : item.toLowerCase()
      )
      .join("");
  },
  moreVowels(text) {
    let textArray = text.split("");
    for (i = 0; i < text.length; i++) {
      let moreVowels = "";
      if (Tools.isVowel(text.charAt(i))) {
        let extraRand = Tools.getRandomInt({ min: 1, max: 10 });
        for (j = 1; j <= extraRand; j++) {
          moreVowels += text.charAt(i);
          textArray.splice(i, 1, moreVowels);
        }
      }
    }
    return textArray.join();
  },
};
