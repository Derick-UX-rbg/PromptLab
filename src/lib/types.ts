export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  messages: ChatMessage[];
  modelId: string;
  imageBase64?: string | null;
  imageMimeType?: string | null;
  videoNote?: string | null;
  rewriteForModel?: boolean;
}

export interface ChatResponseBody {
  message: string;
  prompt?: string | null;
  mock?: boolean;
  error?: string;
}
