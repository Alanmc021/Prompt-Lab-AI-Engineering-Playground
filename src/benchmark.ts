import "dotenv/config";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { explainV1 } from "./prompts/explain.v1.js";
import { explainV2 } from "./prompts/explain.v2.js";
import { runPrompt } from "./chains/explain.chain.js";
import { judgeExplanation } from "./evaluator/ai-judge.js";
import { benchmarkTopics } from "./dataset/topics.js";

type Version = "v1" | "v2";

type RunRecord = {
  topic: string;
  version: Version;
  judge: {
    score: number;
    label: "weak" | "average" | "good";
    clarity: number;
    accuracy: number;
    utility: number;
    feedback: string;
  };
  latencyMs: number;
  estimatedTokens: number;
  estimatedCostUsd: number;
  createdAt: string;
};

const PRICE_PER_1K_TOKENS_USD = 0.0005;

function estimateTokensFromText(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function estimateCostUsd(totalTokens: number): number {
  return (totalTokens / 1000) * PRICE_PER_1K_TOKENS_USD;
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

async function runOne(topic: string, version: Version): Promise<RunRecord> {
  const prompt = version === "v1" ? await explainV1.format({ topic }) : await explainV2.format({ topic });

  const startedAt = performance.now();
  const output = await runPrompt(prompt, version);
  const judge = await judgeExplanation(topic, version, output);
  const latencyMs = performance.now() - startedAt;

  const rawText = `${prompt}\n${output.definition}\n${output.example}`;
  const estimatedTokens = estimateTokensFromText(rawText);
  const estimatedCostUsd = estimateCostUsd(estimatedTokens);

  return {
    topic,
    version,
    judge,
    latencyMs: Math.round(latencyMs),
    estimatedTokens,
    estimatedCostUsd: Number(estimatedCostUsd.toFixed(6)),
    createdAt: new Date().toISOString(),
  };
}

function summarize(records: RunRecord[], version: Version) {
  const scoped = records.filter((r) => r.version === version);
  return {
    count: scoped.length,
    avgScore: Number(avg(scoped.map((r) => r.judge.score)).toFixed(2)),
    avgLatencyMs: Number(avg(scoped.map((r) => r.latencyMs)).toFixed(0)),
    totalEstimatedTokens: scoped.reduce((sum, r) => sum + r.estimatedTokens, 0),
    totalEstimatedCostUsd: Number(
      scoped.reduce((sum, r) => sum + r.estimatedCostUsd, 0).toFixed(6)
    ),
  };
}

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runsDir = join(process.cwd(), "runs");
  await mkdir(runsDir, { recursive: true });

  const records: RunRecord[] = [];

  for (const topic of benchmarkTopics) {
    console.log(`Running benchmark topic: ${topic}`);
    records.push(await runOne(topic, "v1"));
    records.push(await runOne(topic, "v2"));
  }

  const v1Summary = summarize(records, "v1");
  const v2Summary = summarize(records, "v2");
  const winnerByAvgScore =
    v2Summary.avgScore > v1Summary.avgScore
      ? "v2"
      : v2Summary.avgScore < v1Summary.avgScore
        ? "v1"
        : "tie";

  const summary = {
    generatedAt: new Date().toISOString(),
    note: "Tokens and costs are estimates for comparison purposes.",
    topics: benchmarkTopics,
    versions: {
      v1: v1Summary,
      v2: v2Summary,
    },
    winnerByAvgScore,
  };

  const payload = { summary, records };
  const outputFile = join(runsDir, `benchmark-${timestamp}.json`);
  await writeFile(outputFile, JSON.stringify(payload, null, 2), "utf-8");

  console.log("\n--- BENCHMARK SUMMARY ---");
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nSaved benchmark file: ${outputFile}`);
}

main().catch((error) => {
  console.error("Benchmark failed:", error);
  process.exit(1);
});
