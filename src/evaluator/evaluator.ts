import type { ExplainOutput } from "../chains/explain.chain.js";

export type Evaluation = "weak" | "average" | "good";

export function evaluate(output: ExplainOutput): Evaluation {
  const text = `${output.definition} ${output.example}`.trim();

  if (text.length < 80) return "weak";
  if (output.example.length >= 20) return "good";
  return "average";
}
