import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.BASE_AI_URL,
});
