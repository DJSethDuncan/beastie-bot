declare module "handlers";
declare module "config";
declare module "tools";
declare module "openai";
declare module "processMessage";

export interface MessagePayloadType {
  channel: {
    type: string;
  };
  author: {
    id: string;
    username: string;
    avatarURL: string;
  };
  content: string;
}

export interface BotHandlerProps {
  message: string;
  author: {
    id: string;
  };
}

export interface GenericHandlerProps {
  message: string;
}

export interface TextModifierType {
  text: string;
}

export interface WordCollectionType {
  [key: string]: string[];
}

export interface TriggerWordHandlerType {
  [key: string]: ({
    message,
    author,
  }: BotHandlerProps) => Promise<string | undefined>;
}
