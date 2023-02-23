# beastie-bot

A Discord bot.

BeastieBot started as a simple joke, but he is growing smarter.

Example:

![image](https://user-images.githubusercontent.com/4060878/218017190-af2bf800-5a42-415b-9d9b-cc36e420478b.png)

- uses [discord.js](https://discordjs.guide/)
- uses [openAI](https://openai.com/api/)
- uses TypeScript

## Features

- `bot [query]` - Generates a text reply using `curie` -- a middle-of-the-road openai model
- `bot smartly [query]` - Generates a text reply using `davinci` -- a smarter openai model
- `bot dumbly [query]` - Generates a text reply using `ada` -- a pretty bad openai model
- `bot image [query]` - Generates an image using Dall-E

### Handlers

Each "handler" function takes a Discord message payload and does something with it. These handlers allow us to do different things based on the incoming message.

#### Trigger word handler

The `triggerWordHandler` object in `bin/processMessage.ts` is a key/value pair that should match a trigger word with a handler function. A 'trigger word' is the first word of a Discord message. The primary example of this is the `bot [query]` situation.

When `client.on("message"),...` is fired, it will check if the first word of the message matches a key in `triggerWordHandler` and, if so, pass the Discord message to the associated handler.

Let's say you wanted to add a new trigger word. Say you wanted to do something specific whenever a user typed `jarvis ...` -- you would just need to modify the `triggerWordHandler` object to include `jarvis: someHandlerFunction` and it would (should) automatically work.

#### Generic handler

This is the last handler in the chain. If nothing has triggered yet, this handler will scan the message. For now, it's just looking for 'trigger' words to reply to.

### Reply collections

You can use the `getRandomReplyFromCollection(someCollectionName)` function in `/bin/tools.ts` to get a random reply from an array. Whatever string you pass to this function must match a key-name in the `replyCollections` object in `/bin/config.ts`.

### Word collections

You can use `hasWordInWordCollection({messageContent: '', wordCollection: ''})` where `messageContent` is some string you want to search through, and `wordCollection` is a string that matches a key in the `wordCollections` object in `/bin/config.ts`

### Ignore users

If you enter a Discord user Id into the `ignoreUsers` array in `/bin/config.ts` any messages from that user will be ignored. This repo includes the userId associated with this bot on my own Discord server, but you can swap it out with whatever you want.

### Be sarcastic to users

An array of user Ids in `beSarcasticToUsers` in `/bin/config.ts` -- any users in this array will get a spongebob-meme style alternating caps reply of whatever they asked the bot.

Ex:

```
user: bot how are you?
bot: hOw ArE yOu?
```

## How to work on this repo

As long as you have NodeJS installed, this should work without you having to do anything special. I built this using LTS (v18).

Note: This bot will work if it's running, so if you just spin it up on your own computer or a Raspberry Pi or something it'll respond in your Discord as long as you've configured your Discord server to work w/ a bot and put the key in the `.env` file.

- `git clone`
- `npm i`
- fill in `.env` using the keys shown in `.env.example`
- `npm run dev` OR `npm start`


Note: If you run `npm run dev` the bot will run but will _suppress_ responses so they don't go to your Discord. They will log in the console so you can see what the responses would be. This prevents your development-environment from double-posting to an active Discord server if you already have a version of this bot running "in production."
