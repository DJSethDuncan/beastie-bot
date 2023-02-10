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
  processMessage(message) {
    try {
      const action = {
        response: "",
      };

      const { channel, author, content } = message;

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

      // beastie bot reply
      if (this.hasWordInList(content, wordLists.beastie)) {
        action.response = this.beastieBoysify(content);
      }

      // DM reply
      if (channel.type === "dm") {
        action.response = this.sarcasm(content);
      }

      // return
      return action;
    } catch (e) {
      console.error("There was a problem processing this message.");
      console.error(e);
    }
  },
  hasWordInList(messageContent, wordList) {
    const messageContentArray = messageContent.toLowerCase().split(" ");
    const intersection = messageContentArray.filter((element) =>
      wordList.includes(element)
    );
    return !!intersection.length;
  },
  beastieBoysify(text) {
    const capitalizeRand = this.getRandomInt(3, 10);
    const exclamationPointsRand = this.getRandomInt(0, 10);
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
        index % 2 === 0 ? item.toUpperCase() : item.toLowerCase()
      )
      .join("");
  },
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  moreVowels(text) {
    let textArray = text.split("");
    for (i = 0; i < text.length; i++) {
      let moreVowels = "";
      if (this.isVowel(text.charAt(i))) {
        let extraRand = this.getRandomInt(1, 10);
        for (j = 1; j <= extraRand; j++) {
          moreVowels += text.charAt(i);
          textArray.splice(i, 1, moreVowels);
        }
      }
    }
    return textArray.join();
  },
  isVowel(c) {
    //@TODO replace with a package
    return ["a", "e", "i", "o", "u"].indexOf(c.toLowerCase()) !== -1;
  },
};
