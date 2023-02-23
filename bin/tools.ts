import { config } from "./config";

export const getFirstWordLowercase = ({ text }: { text: string }): string => {
  const stringArray = text.toLowerCase().split(" ");
  // drop any punctuation attached to the first word
  return stripAlphaNum({ text: stringArray[0] });
};

export const removeFirstWord = ({ text }: { text: string }): string => {
  return text.split(" ").slice(1).join(" ");
};

export const hasWordInWordCollection = ({
  messageContent,
  wordCollectionName,
}: {
  messageContent: string;
  wordCollectionName: string;
}): boolean => {
  const messageContentArray = messageContent.toLowerCase().split(" ");
  const intersection = config.wordCollections[wordCollectionName].filter(
    (element: string) => messageContentArray.includes(element)
  );
  return !!intersection.length;
};

export const getRandomInt = ({
  min,
  max,
}: {
  min: number;
  max: number;
}): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isVowel = ({ character }: { character: string }): boolean => {
  return ["a", "e", "i", "o", "u"].indexOf(character.toLowerCase()) !== -1;
};

export const beastieBoysify = ({ text }: { text: string }): string => {
  const capitalizeRand = getRandomInt({ min: 3, max: 10 });
  const exclamationPointsRand = getRandomInt({
    min: 0,
    max: 10,
  });
  const messageArray = text.split(" ");
  let beastieReply = messageArray[messageArray.length - 1];
  let exclamationPoints = "";
  for (let i: number = 1; i <= exclamationPointsRand; i++) {
    exclamationPoints += "!";
  }
  // capitalize
  if (capitalizeRand > 5) {
    beastieReply = moreVowels({ text: beastieReply });
    beastieReply = beastieReply.toUpperCase();
  }
  // strip non alphanum
  beastieReply = stripAlphaNum({ text: beastieReply });
  // add exclamation points
  beastieReply += exclamationPoints;
  return beastieReply;
};

export const sarcasm = ({ text }: { text: string }): string => {
  return text
    .split("")
    .map((item, index) =>
      index % 2 === 1 ? item.toUpperCase() : item.toLowerCase()
    )
    .join("");
};

export const moreVowels = ({ text }: { text: string }): string => {
  let textArray = text.split("");
  for (let i: number = 0; i < text.length; i++) {
    let moreVowels: string = "";
    if (isVowel({ character: text.charAt(i) })) {
      let extraRand: number = getRandomInt({ min: 1, max: 10 });
      for (let j: number = 1; j <= extraRand; j++) {
        moreVowels += text.charAt(i);
        textArray.splice(i, 1, moreVowels);
      }
    }
  }
  return textArray.join();
};

export const stripAlphaNum = ({ text }: { text: string }): string => {
  return text.replace(/\W/g, "");
};

export const getRandomReplyFromCollection = ({
  collectionName,
}: {
  collectionName: string;
}): string => {
  if (collectionName in config.replyCollections) {
    const thisCollection = config.replyCollections[collectionName];
    return thisCollection[
      getRandomInt({ min: 0, max: thisCollection.length - 1 })
    ];
  } else {
    return "";
    console.error(`No collection name found for ${collectionName}`);
  }
};
