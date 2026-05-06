import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const ExplainSchema = z.object({
  definition: z.string().min(1),
  example: z.string().min(1),
});

const llm = new ChatOpenAI({
  model: "gpt-4.1-mini",
  temperature: 0.3,
});

const structuredLlm = llm.withStructuredOutput(ExplainSchema, {
  name: "explain_topic",
});

export type ExplainOutput = z.infer<typeof ExplainSchema>;

export async function runPrompt(input: string, version: "v1" | "v2") {
  return structuredLlm.invoke(input, {
    runName: `explain_${version}`,
    tags: ["study", "prompt-lab", version],
    metadata: { prompt_version: version },
  });
}
