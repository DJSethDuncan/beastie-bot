const OpenAI = require("openai");
const configuration = new OpenAI.Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAI.OpenAIApi(configuration);

module.exports = {
  async chatgpt({ query, model = "davinci" }) {
    const models = {
      davinci: "text-davinci-003",
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
  },
  async dalle(query) {
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
  },
};
