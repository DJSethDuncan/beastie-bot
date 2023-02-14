module.exports = {
  firstWordIs(string, firstWord) {
    const wordArray = string.split(" ");
    return wordArray[0] === firstWord;
  },
};
