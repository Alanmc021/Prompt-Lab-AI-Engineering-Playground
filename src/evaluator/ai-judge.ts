import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

import type { ExplainOutput } from "../chains/explain.chain.js";

const JudgeSchema = z.object({
  score: z.number().min(0).max(10),
  label: z.enum(["weak", "average", "good"]),
  clarity: z.number().min(0).max(10),
  accuracy: z.number().min(0).max(10),
  utility: z.number().min(0).max(10),
  feedback: z.string().min(1),
});

const judgeModel = new ChatOpenAI({
  model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  temperature: 0,
});

const structuredJudge = judgeModel.withStructuredOutput(JudgeSchema, {
  name: "judge_explanation_quality",
});

export type AiJudgeResult = z.infer<typeof JudgeSchema>;

export async function judgeExplanation(
  topic: string,
  version: "v1" | "v2",
  output: ExplainOutput
): Promise<AiJudgeResult> {
  const prompt = [
    "You are an AI evaluator for explanation quality.",
    "Evaluate the answer and return a strict JSON object.",
    "Scoring criteria:",
    "- clarity: is the explanation easy to understand?",
    "- accuracy: is it technically correct?",
    "- utility: is the example practical and useful?",
    "Rules:",
    "- each criterion is a number from 0 to 10",
    "- score is overall 0 to 10",
    '- label is "weak" for score < 5, "average" for score >= 5 and < 8, "good" for score >= 8',
    "- feedback must be one short sentence in pt-BR",
    "",
    `Topic: ${topic}`,
    `Version: ${version}`,
    `Definition: ${output.definition}`,
    `Example: ${output.example}`,
  ].join("\n");

  return structuredJudge.invoke(prompt, {
    runName: `ai_judge_${version}`,
    tags: ["study", "prompt-lab", "ai-judge", version],
    metadata: { topic, prompt_version: version },
  });
}
