import { config } from "./config";
import type { TextModifierType } from "../types";

export const isVowel = ({ character }: { character: string }): boolean => {
  return ["a", "e", "i", "o", "u"].indexOf(character.toLowerCase()) !== -1;
};

/* Collection Related Functions */
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
    console.error(`No collection name found for ${collectionName}`);
    return "";
  }
};

/* Dice */
const MAX_DICE = 20;
const MAX_SIDES = 1000;

// Parses "", "d20", "2d6" or "3d8+2" and returns the roll as a chat reply.
export const rollDice = ({ text }: TextModifierType): string => {
  const notation = text.trim().split(" ")[0].toLowerCase();
  const match = /^(\d*)d(\d+)([+-]\d+)?$/.exec(notation || "d6");
  if (!match) {
    return "Try `roll`, `roll d20`, `roll 2d6` or `roll 3d8+2`.";
  }
  const count = match[1] ? parseInt(match[1], 10) : 1;
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;
  if (count < 1 || count > MAX_DICE || sides < 2 || sides > MAX_SIDES) {
    return `I roll 1-${MAX_DICE} dice with 2-${MAX_SIDES} sides.`;
  }
  const rolls = Array.from({ length: count }, () =>
    getRandomInt({ min: 1, max: sides })
  );
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
  if (count === 1 && modifier === 0) return `:game_die: ${total}`;
  const modifierText = modifier ? ` ${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)}` : "";
  return `:game_die: ${total} (${rolls.join(" + ")}${modifierText})`;
};

/* Text Modifying Functions */
export const getFirstWordLowercase = ({ text }: TextModifierType): string => {
  const stringArray = text.toLowerCase().split(" ");
  // drop any punctuation attached to the first word
  return stripAlphaNum({ text: stringArray[0] });
};

export const removeFirstWord = ({ text }: TextModifierType): string => {
  return text.split(" ").slice(1).join(" ");
};

export const beastieBoysify = ({ text }: TextModifierType): string => {
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

export const sarcasm = ({ text }: TextModifierType): string => {
  return text
    .split("")
    .map((item, index) =>
      index % 2 === 1 ? item.toUpperCase() : item.toLowerCase()
    )
    .join("");
};

export const moreVowels = ({ text }: TextModifierType): string => {
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

export const stripAlphaNum = ({ text }: TextModifierType): string => {
  return text.replace(/\W/g, "");
};
