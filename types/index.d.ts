declare module "handlers";
declare module "config";
declare module "tools";
declare module "openai";
declare module "processMessage";

export interface MessagePayloadType {
  channel: {
    name: string;
    type: string;
  };
  author: {
    username: string;
    id: string;
  };
  content: string;
}

export interface BotHandlerProps {
  message: string;
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
  [key: string]: ({ message }: BotHandlerProps) => Promise<string | undefined>;
}
