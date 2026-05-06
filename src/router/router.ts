export function route(input: string): "rag" | "prompt" | "general" {
  const normalized = input.toLowerCase();

  if (normalized.includes("rag")) return "rag";
  if (normalized.includes("prompt")) return "prompt";
  return "general";
}
