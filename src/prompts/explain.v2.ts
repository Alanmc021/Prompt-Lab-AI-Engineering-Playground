import { ChatPromptTemplate } from "@langchain/core/prompts";

export const explainV2 = ChatPromptTemplate.fromMessages([
  [
    "system",
    [
      "You are a senior AI engineer.",
      "Provide concise, practical explanations focused on backend systems.",
      "Avoid generic statements and prioritize actionable clarity.",
    ].join(" "),
  ],
  [
    "human",
    [
      "Explain {topic} in a practical way.",
      "Return a JSON object with keys:",
      "- definition: string",
      "- example: string",
    ].join("\n"),
  ],
]);
