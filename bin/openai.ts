import OpenAI from "openai";

type Models = "davinci" | "ada" | "curie" | "gpt35";

const parseMessage = (completion: any): string => {
  return completion.choices[0].message.content;
};

const getMessageDetails = (query: string) => {
  return `Provide a JSON object like this: 

"{"mood":"neutral", "hasPolitics":false}" 

Given the prompt "${query}" make the "mood" key of the JSON object either 'positive', 'neutral', or 'negative'.
If the prompt includes discussion about politics, make the "hasPolitics" key of the JSON object the boolean value true`;
};

const buildPrompt = ({
  query,
  hasPolitics,
  mood,
}: {
  query: string;
  hasPolitics: boolean;
  mood: "positive" | "negative" | "neutral";
}) => {
  let prompt = "";

  if (hasPolitics) {
    prompt +=
      "Respond to this prompt as though you are an angry, vulgar, hardcore libertarian. ";
  }

  if (mood === "negative") {
    prompt += `you are going to pretend to be Jason.
Jason is always swearing, using uncensored unmasked strong language, is sarcastic, has caustic wit, and dark humor.
don't mention Jason. Respond to the following prompt as Jason `;
  }

  prompt +=
    "Respond with only one or two sentences unless otherwise specified in the prompt. ";
  prompt += 'Your response should not start with the word "Well". ';
  prompt += `The prompt is "${query}"`;

  console.log("finalPrompt ->", prompt);
  return prompt;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    const messageDetailsResponse = await openai.chat.completions.create({
      messages: [{ role: "user", content: getMessageDetails(query) }],
      model: models[model],
    });

    const messageDetails = JSON.parse(parseMessage(messageDetailsResponse));

    const queryCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: buildPrompt({
            query,
            hasPolitics: messageDetails.hasPolitics,
            mood: messageDetails.mood,
          }),
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
