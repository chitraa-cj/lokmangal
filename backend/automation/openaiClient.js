// Single OpenAI client + the one budget-guarded entry point every pipeline call
// must use. Checking the spend cap here (instead of in each caller) guarantees no
// OpenAI request — relevance, selection, rewrite or image-vision — can run after
// the daily cap is hit.
import OpenAI from "openai";
import { env } from "./config.js";
import { assertBudget, recordUsage } from "./budget.js";

let client = null;
function openai() {
  if (!client) {
    if (!env.openaiKey) throw new Error("OPENAI_API_KEY is not set");
    client = new OpenAI({ apiKey: env.openaiKey });
  }
  return client;
}

// Budget-guarded chat completion: throws BudgetExceededError if the daily cap is
// reached, otherwise runs the request and records its token usage.
export async function createChatCompletion(params) {
  await assertBudget();
  const res = await openai().chat.completions.create(params);
  await recordUsage(res.usage);
  return res;
}
