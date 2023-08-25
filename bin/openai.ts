import OpenAI from "openai";

type Models = "davinci" | "ada" | "curie" | "gpt35";

const getMoodPrompt = (query: string) => {
  return `reply with one word, lower case, no punctuation. Would you describe the following query as 'positive', 'neutral', or 'negative': "${query}"`;
};

const getAngryPrompt = (query: string) => {
  return `you are going to pretend to be Jason.
Jason is always swearing, using uncensored unmasked strong language, is sarcastic, has caustic wit, and dark humor.
don't mention Jason. Respond to the following prompt as Jason with one or two sentences.

"${query}"`;
};

const parseMessage = (completion: any) => {
  return completion.choices[0].message.content;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.ORG_ID,
});

export const chatgpt = async ({
  query,
  model = "gpt35",
}: {
  query: string;
  model?: Models;
}): Promise<string | null> => {
  const models = {
    gpt: "gpt-3.5-turbo",
    davinci: "text-davinci-003",
    ada: "text-ada-001",
    curie: "text-curie-001",
    gpt35: "gpt-3.5-turbo",
  };
  try {
    const moodCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: getMoodPrompt(query) }],
      model: models[model],
    });

    const mood = parseMessage(moodCompletion); // positive, neutral, negative

    const queryCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: mood === "negative" ? getAngryPrompt(query) : query,
        },
      ],
      model: models[model],
    });

    const response = parseMessage(queryCompletion);

    return response;
  } catch (error) {
    console.error(error);
    return "No.";
  }
};

export const dalle = async ({
  query,
}: {
  query: string;
}): Promise<string | undefined> => {
  try {
    const openAIImageResponse = await openai.images.generate({
      prompt: query,
      n: 1,
      size: "512x512",
    });
    return openAIImageResponse.data[0].url;
  } catch (error) {
    console.error(error);
    return "No.";
  }
};
