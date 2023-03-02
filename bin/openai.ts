import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const chatgpt = async ({
  query,
  model = "gpt",
}: {
  query: string;
  model?: "gpt" | "davinci" | "ada" | "curie";
}): Promise<string | undefined> => {
  const models = {
    gpt: "gpt-3.5-turbo",
    davinci: "text-davinci-003",
    ada: "text-ada-001",
    curie: "text-curie-001",
  };
  try {
    const openAIresponse = await openai.createChatCompletion({
      model: models[model],
      messages: [{ role: "user", content: query }],
      max_tokens: 500,
      temperature: 0.8,
    });
    return openAIresponse.data.choices[0].message
      ? openAIresponse.data.choices[0].message.content
      : undefined;
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
    const openAIImageResponse = await openai.createImage({
      prompt: query,
      n: 1,
      size: "512x512",
    });
    return openAIImageResponse.data.data[0].url;
  } catch (error) {
    console.error(error);
    return "No.";
  }
};
