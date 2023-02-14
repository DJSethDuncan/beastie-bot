module.exports = {
  nthWordIs({ string, firstWord, n = 0 }) {
    const wordArray = string.split(" ");
    return wordArray[n] === firstWord;
  },
  removeFirstWord(string) {
    return string.split(" ").slice(1).join(" ");
  },
  hasWordInList({ messageContent, wordList }) {
    const messageContentArray = messageContent.toLowerCase().split(" ");
    const intersection = messageContentArray.filter((element) =>
      wordList.includes(element)
    );
    return !!intersection.length;
  },
  getRandomInt({ min, max }) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  isVowel(character) {
    //@TODO replace with a package
    return ["a", "e", "i", "o", "u"].indexOf(character.toLowerCase()) !== -1;
  },
};
