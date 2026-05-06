import "dotenv/config";

import { explainV1 } from "./prompts/explain.v1.js";
import { explainV2 } from "./prompts/explain.v2.js";
import { runPrompt } from "./chains/explain.chain.js";
import { evaluate } from "./evaluator/evaluator.js";
import { route } from "./router/router.js";

async function main() {
  if (process.env.LANGSMITH_TRACING === "true" && !process.env.LANGSMITH_API_KEY) {
    console.warn(
      "LangSmith tracing is enabled, but LANGSMITH_API_KEY is missing. Traces will not be sent."
    );
  }

  const topic = process.argv[2] ?? "RAG";

  console.log(`Route: ${route(topic)}`);

  const v1Prompt = await explainV1.format({ topic });
  const v2Prompt = await explainV2.format({ topic });

  console.log("Running V1...");
  const v1 = await runPrompt(v1Prompt, "v1");

  console.log("Running V2...");
  const v2 = await runPrompt(v2Prompt, "v2");

  console.log("\n--- RESULT ---");
  console.log("V1:", v1);
  console.log("V2:", v2);

  console.log("\n--- EVALUATION ---");
  console.log("V1:", evaluate(v1));
  console.log("V2:", evaluate(v2));
}

main().catch((error) => {
  console.error("Runner failed:", error);
  process.exit(1);
});
