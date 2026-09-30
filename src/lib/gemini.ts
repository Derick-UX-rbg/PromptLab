import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import type { ChatMessage } from "./types";
import { buildSystemPrompt } from "./system-prompt";

export function hasApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function extractPromptBlock(text: string): string | null {
  const match = text.match(/```prompt\s*([\s\S]*?)```/i);
  if (match?.[1]) return match[1].trim();
  return null;
}

function toGeminiHistory(messages: ChatMessage[]) {
  // Gemini wants alternating user/model. Drop system; fold into systemInstruction.
  const filtered = messages.filter((m) => m.role === "user" || m.role === "assistant");
  return filtered.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function runChat(opts: {
  messages: ChatMessage[];
  modelId: string;
  imageBase64?: string | null;
  imageMimeType?: string | null;
  videoNote?: string | null;
  rewriteForModel?: boolean;
}): Promise<{ text: string; prompt: string | null }> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error("MISSING_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: buildSystemPrompt(opts.modelId, opts.rewriteForModel),
  });

  const history = toGeminiHistory(opts.messages.slice(0, -1));
  const last = opts.messages[opts.messages.length - 1];
  if (!last || last.role !== "user") {
    throw new Error("Last message must be from user");
  }

  let userText = last.content;
  if (opts.videoNote) {
    userText += `\n\n[Video reference note: ${opts.videoNote}]`;
  }

  const parts: Part[] = [{ text: userText }];
  if (opts.imageBase64 && opts.imageMimeType) {
    parts.push({
      inlineData: {
        data: opts.imageBase64.replace(/^data:[^;]+;base64,/, ""),
        mimeType: opts.imageMimeType,
      },
    });
  }

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(parts);
  const text = result.response.text();
  return { text, prompt: extractPromptBlock(text) };
}

export function mockChatReply(opts: {
  messages: ChatMessage[];
  modelId: string;
  rewriteForModel?: boolean;
}): { text: string; prompt: string | null } {
  const lastUser = [...opts.messages].reverse().find((m) => m.role === "user");
  const brief = lastUser?.content?.trim() || "a cinematic portrait";
  const short = brief.length > 120 ? brief.slice(0, 117) + "…" : brief;

  const templates: Record<string, string> = {
    midjourney: `${short}, ultra detailed, dramatic lighting, 85mm lens look --ar 16:9 --stylize 250 --v 6.1`,
    flux: `A highly detailed scene: ${short}. Natural lighting, sharp focus, rich texture, cinematic color grade.`,
    sdxl: `${short}, intricate detail, volumetric lighting, masterpiece, best quality`,
    "gpt-image": `Create an image of ${short}. Emphasize composition, materials, and lighting. Clean, intentional framing.`,
    ideogram: `${short}. Include clear readable typography if text is requested. Bold layout, high contrast.`,
    imagen: `Photorealistic depiction of ${short}. Natural light, shallow depth of field, editorial quality.`,
    veo: `Cinematic shot: ${short}. Slow push-in, subtle subject motion, atmospheric lighting, 4-second beat.`,
    kling: `${short}. Camera tracks smoothly; subject moves with purpose; environment reacts; filmic motion blur.`,
    runway: `${short}. Locked framing then gentle dolly. Clear action beat. Moody grade.`,
    sora: `A continuous shot of ${short}. Physically plausible motion, evolving light, immersive camera path.`,
  };

  const prompt =
    templates[opts.modelId] ??
    `${short} — crafted for ${opts.modelId} (demo mode).`;

  const text = opts.rewriteForModel
    ? `**(Demo mode — no GEMINI_API_KEY)** Rewrote for **${opts.modelId}**:\n\n\`\`\`prompt\n${prompt}\n\`\`\`\n\nTip: Add \`GEMINI_API_KEY\` for live Gemini chat + vision. Get a key at https://aistudio.google.com/apikey`
    : `**(Demo mode — no GEMINI_API_KEY)** Here's a starter prompt based on your brief. Clarify mood, camera, and style for better results once Gemini is connected.\n\n\`\`\`prompt\n${prompt}\n\`\`\`\n\nSet \`GEMINI_API_KEY\` in your environment to unlock the full prompt engineer agent (clarifying questions, vision refs, model-specific rewrites).`;

  return { text, prompt };
}
