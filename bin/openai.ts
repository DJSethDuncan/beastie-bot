import OpenAI from "openai";
const configuration = new OpenAI.Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI.OpenAIApi(configuration);

export const chatgpt = async ({
  query,
  model = "curie",
}: {
  query: string;
  model?: "davinci" | "ada" | "curie";
}) => {
  const models = {
    davinci: "text-davinci-003",
    ada: "text-ada-001",
    curie: "text-curie-001",
  };
  try {
    const openAIresponse = await openai.createCompletion({
      model: models[model],
      prompt: query,
      max_tokens: 500,
      temperature: 0.8,
    });
    return openAIresponse.data.choices[0].text;
  } catch (e) {
    console.error(e);
    return "No.";
  }
};

export const dalle = async ({ query }: { query: string }) => {
  try {
    const openAIImageResponse = await openai.createImage({
      prompt: query,
      n: 1,
      size: "512x512",
    });
    return openAIImageResponse.data.data[0].url;
  } catch (e) {
    console.error(e);
    return "No.";
  }
};
