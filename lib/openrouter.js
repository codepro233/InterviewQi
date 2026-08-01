const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error("Please define OPENROUTER_API_KEY in .env.local");
}

const FREE_MODELS = [
  "openrouter/free",
  "meta-llama/llama-4-maverick:free",
  "meta-llama/llama-4-scout:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "google/gemma-3-27b:free",
  "google/gemma-3-13b-it:free",
  "google/gemma-3-13b:free",
  "google/gemma-3-7b-it:free",
  "google/gemma-3-7b:free",
  "google/gemma-3-3b-it:free",
  "google/gemma-3-3b:free",
  "nvidia/llama-4.1-nemotron-ultra-253b-v1:free", 
  "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
];

export async function chatCompletion({ systemPrompt, messages, maxTokens = 1000 }) {
  let lastError = "";

  for (const model of FREE_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXTAUTH_URL ?? "http://localhost:3000",
          "X-Title": "InterviewIQ",
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.warn(`Model ${model} failed:`, err);
        lastError = err;
        continue;
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content ?? "";

      if (content) {
        console.log(`✓ Used model: ${model}`);
        return content;
      }

      lastError = `${model}: empty response`;
    } catch (err) {
      console.warn(`Model ${model} threw:`, err.message);
      lastError = err.message;
      continue;
    }
  }

   throw new Error(`All models failed. Last error: ${lastError}`);
}