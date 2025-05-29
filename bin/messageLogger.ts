import * as fs from 'fs';
import * as path from 'path';
import type { MessagePayloadType } from '../types';

interface LoggedMessage {
  timestamp: number;
  author: {
    username: string;
    avatarURL: string;
  };
  channel: {
    type: string;
  };
  content: string;
}

const MAX_MESSAGES = 1000;
const LOG_FILE = path.join(__dirname, '../message_log.json');
let messages: LoggedMessage[] = [];
let currentIndex = 0;

const loadMessages = (): void => {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const data = fs.readFileSync(LOG_FILE, 'utf8');
      messages = JSON.parse(data);
      currentIndex = messages.length % MAX_MESSAGES;
    }
  } catch (error) {
    console.error('Error loading message log:', error);
    messages = [];
    currentIndex = 0;
  }
};

const saveMessages = (): void => {
  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error saving message log:', error);
  }
};

export const logMessage = (messagePayload: MessagePayloadType): void => {

  const { channel, content } = messagePayload;
  
  const loggedPayload = {
    timestamp: Date.now(),
    author: {
      id: messagePayload.author.id,
      username: messagePayload.author.username,
      avatarURL: messagePayload.author.avatarURL
    },
    channel: {
      type: channel.type
    },
    content
  }

  const loggedMessage: LoggedMessage = loggedPayload;

  if (messages.length < MAX_MESSAGES) {
    messages.push(loggedMessage);
  } else {
    messages[currentIndex] = loggedMessage;
    currentIndex = (currentIndex + 1) % MAX_MESSAGES;
  }

  saveMessages();
};

export const getMessages = (): LoggedMessage[] => {
  return [...messages];
};

// Initialize the message log on module load
loadMessages(); 