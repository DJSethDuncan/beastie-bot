module.exports = {
  nthWordIs(string, firstWord, n = 0) {
    const wordArray = string.split(" ");
    return wordArray[n] === firstWord;
  },
};
