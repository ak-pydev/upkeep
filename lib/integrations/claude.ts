export interface ClaudeMessageInput {
  system: string;
  user: string;
  maxTokens?: number;
}

export interface ClaudeConfig {
  apiKey: string;
  model: string;
}

export function getClaudeConfig(): ClaudeConfig | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    model: process.env.CLAUDE_MODEL ?? "claude-sonnet-4-20250514"
  };
}

export async function generateClaudeAnswer(input: ClaudeMessageInput) {
  const config = getClaudeConfig();
  if (!config) {
    return null;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: input.maxTokens ?? 700,
      system: input.system,
      messages: [
        {
          role: "user",
          content: input.user
        }
      ]
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Claude request failed: ${response.status} ${message}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text = data.content
    ?.filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  return text || null;
}

