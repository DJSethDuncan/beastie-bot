const wordLists = require("./wordLists");

module.exports = {
  getFirstWordLowercase(string) {
    const stringArray = string.toLowerCase().split(" ");
    // drop any punctuation attached to the first word
    return module.exports.stripAlphaNum(stringArray[0]);
  },
  removeFirstWord(string) {
    return string.split(" ").slice(1).join(" ");
  },
  hasWordInWordList({ messageContent, wordList }) {
    const messageContentArray = messageContent.toLowerCase().split(" ");
    const intersection = wordLists[wordList].filter((element) =>
      messageContentArray.includes(element)
    );
    return !!intersection.length;
  },
  getRandomInt({ min, max }) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  isVowel(character) {
    return ["a", "e", "i", "o", "u"].indexOf(character.toLowerCase()) !== -1;
  },
  beastieBoysify(text) {
    const capitalizeRand = module.exports.getRandomInt({ min: 3, max: 10 });
    const exclamationPointsRand = module.exports.getRandomInt({
      min: 0,
      max: 10,
    });
    const messageArray = text.split(" ");
    let beastieReply = messageArray[messageArray.length - 1];
    let exclamationPoints = "";
    for (i = 1; i <= exclamationPointsRand; i++) {
      exclamationPoints += "!";
    }
    // capitalize
    if (capitalizeRand > 5) {
      beastieReply = module.exports.moreVowels(beastieReply);
      beastieReply = beastieReply.toUpperCase();
    }
    // strip non alphanum
    beastieReply = module.exports.stripAlphaNum(beastieReply);
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
      if (module.exports.isVowel(text.charAt(i))) {
        let extraRand = module.exports.getRandomInt({ min: 1, max: 10 });
        for (j = 1; j <= extraRand; j++) {
          moreVowels += text.charAt(i);
          textArray.splice(i, 1, moreVowels);
        }
      }
    }
    return textArray.join();
  },
  stripAlphaNum(text) {
    return text.replace(/\W/g, "");
  },
};
