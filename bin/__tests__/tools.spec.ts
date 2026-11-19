import {
  isVowel,
  hasWordInWordCollection,
  getRandomInt,
  getRandomReplyFromCollection,
  getFirstWordLowercase,
  removeFirstWord,
  beastieBoysify,
  sarcasm,
  moreVowels,
  stripAlphaNum,
} from "../tools";
import { config } from "../config";

afterEach(() => jest.restoreAllMocks());

describe("isVowel", () => {
  it("matches vowels in either case", () => {
    expect(["a", "E", "i", "O", "u"].every((c) => isVowel({ character: c }))).toBe(true);
  });
  it("rejects consonants", () => {
    expect(isVowel({ character: "b" })).toBe(false);
    expect(isVowel({ character: "Y" })).toBe(false);
  });
});

describe("hasWordInWordCollection", () => {
  it("finds a collection word regardless of case", () => {
    expect(
      hasWordInWordCollection({ messageContent: "Time to PARTY", wordCollectionName: "beastie" })
    ).toBe(true);
  });
  it("returns false when no word matches", () => {
    expect(
      hasWordInWordCollection({ messageContent: "hello there", wordCollectionName: "beastie" })
    ).toBe(false);
  });
});

describe("getRandomInt", () => {
  it("stays within the inclusive range", () => {
    for (let i = 0; i < 1000; i++) {
      const n = getRandomInt({ min: 3, max: 5 });
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(5);
    }
  });
  it("returns min and max at the ends of Math.random", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    expect(getRandomInt({ min: 1, max: 6 })).toBe(1);
    jest.spyOn(Math, "random").mockReturnValue(0.9999);
    expect(getRandomInt({ min: 1, max: 6 })).toBe(6);
  });
});

describe("getRandomReplyFromCollection", () => {
  it("returns a reply from the named collection", () => {
    const reply = getRandomReplyFromCollection({ collectionName: "rateLimit" });
    expect(config.replyCollections.rateLimit).toContain(reply);
  });
  it("returns an empty string for an unknown collection", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    expect(getRandomReplyFromCollection({ collectionName: "nope" })).toBe("");
  });
});

describe("getFirstWordLowercase", () => {
  it("lowercases and strips punctuation from the first word", () => {
    expect(getFirstWordLowercase({ text: "Bot, how are you?" })).toBe("bot");
  });
});

describe("removeFirstWord", () => {
  it("drops the first word", () => {
    expect(removeFirstWord({ text: "bot how are you" })).toBe("how are you");
  });
  it("returns an empty string for a single word", () => {
    expect(removeFirstWord({ text: "bot" })).toBe("");
  });
});

describe("sarcasm", () => {
  it("alternates lower and upper case", () => {
    expect(sarcasm({ text: "hello" })).toBe("hElLo");
  });
});

describe("moreVowels", () => {
  it("repeats each vowel and keeps consonants", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.2); // getRandomInt(1, 10) -> 3
    expect(moreVowels({ text: "party" })).toBe("paaarty");
  });
});

describe("stripAlphaNum", () => {
  it("removes non-word characters", () => {
    expect(stripAlphaNum({ text: "sab-o-tage!!" })).toBe("sabotage");
  });
});

describe("beastieBoysify", () => {
  it("shouts the last word with extra vowels when the capitalize roll is high", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.9); // capitalize roll 9, 10 a's, 9 "!"
    expect(beastieBoysify({ text: "fight for your right to party" })).toBe(
      "PAAAAAAAAAARTY!!!!!!!!!"
    );
  });
  it("keeps the last word lowercase with no exclamation points when rolls are low", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    expect(beastieBoysify({ text: "no sleep till brooklyn." })).toBe("brooklyn");
  });
});
