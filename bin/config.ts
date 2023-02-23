export interface WordCollectionType {
  [key: string]: string[];
}

interface ReplyCollectionType {
  rateLimit: string[];
  [key: string]: string[];
}

interface ConfigType {
  ignoreUsers: string[];
  beSarcasticToUsers: string[];
  wordCollections: WordCollectionType;
  replyCollections: ReplyCollectionType;
  helpText: string;
}

export const config: ConfigType = {
  ignoreUsers: ["804419214894301227"],
  beSarcasticToUsers: [],
  wordCollections: {
    beastie: [
      "beastie boys",
      "beastie",
      "intergalactic",
      "planetary",
      "sabotage",
      "fight",
    ],
  },
  replyCollections: {
    rateLimit: [
      "Daddy, chill...",
      "Dude slow down",
      "omg...",
      "please leave me alone for like TWO SECONDS",
      "Look, ya'll gotta slow down and let me take a break",
    ],
  },
  helpText: `You can say things like:\n
\`bot how are you today\`\n
\`bot image a crying puppy\`\n
\`bot smartly write a play about sadness\` - this uses the davinci model and is my best work\n
There are probably some other trigger words that might get me to chime in.`,
};
