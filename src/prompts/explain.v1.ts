import { ChatPromptTemplate } from "@langchain/core/prompts";

export const explainV1 = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an AI engineer. Explain topics clearly in simple technical language.",
  ],
  ["human", "Explain {topic}."],
]);
