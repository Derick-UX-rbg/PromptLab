import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import type { ChatMessage } from "./types";
import { buildSystemPrompt } from "./system-prompt";
import { getModel } from "./models";

export function hasApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function extractPromptBlock(text: string): string | null {
  const match = text.match(/```prompt\s*([\s\S]*?)```/i);
  if (match?.[1]) return match[1].trim();
  return null;
}

function toGeminiHistory(messages: ChatMessage[]) {
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

function demoPromptForModel(modelId: string, short: string): string {
  const templates: Record<string, string> = {
    "midjourney-v6": `${short}, ultra detailed, dramatic lighting, 85mm lens look --ar 16:9 --stylize 250 --v 6.1`,
    "midjourney-v7": `${short}, coherent cinematic lighting, rich texture, intentional composition --ar 16:9 --stylize 200 --v 7`,
    flux: `A highly detailed scene: ${short}. Natural lighting, sharp focus, rich texture, cinematic color grade.`,
    "flux-schnell": `${short}. Clean composition, clear subject, soft directional light, vivid but natural color.`,
    "flux-pro": `Photoreal depiction of ${short}. Precise materials, controlled lighting, shallow depth of field, editorial finish.`,
    "flux-ultra": `Ultra-detailed rendering of ${short}. Micro-texture, nuanced light falloff, cinematic grade, razor-sharp focal plane.`,
    sdxl: `${short}, intricate detail, volumetric lighting, masterpiece, best quality`,
    "sd-3-5": `${short}, carefully composed, natural lighting, high fidelity detail, coherent perspective`,
    "gpt-image": `Create an image of ${short}. Emphasize composition, materials, and lighting. Clean, intentional framing.`,
    "dalle-3": `A detailed illustration of ${short}. Clear subject focus, balanced composition, vivid but natural colors. No watermark.`,
    ideogram: `${short}. Include clear readable typography if text is requested. Bold layout, high contrast.`,
    imagen: `Photorealistic depiction of ${short}. Natural light, shallow depth of field, editorial quality.`,
    "gemini-image": `${short}. Precise subject and style notes, natural lighting, clean composition suitable for iterative refinement.`,
    leonardo: `${short}, cinematic lighting, detailed textures, dramatic atmosphere, high quality`,
    firefly: `Commercial-ready image of ${short}. Clean composition, brand-safe styling, balanced color grading.`,
    recraft: `Design-forward image of ${short}. Clear visual hierarchy, intentional palette, polished illustration or mockup style.`,
    seedream: `${short}, refined aesthetic, expressive lighting, rich atmosphere, high visual clarity`,
    "grok-imagine": `${short}. Strong subject, distinctive mood, clear composition and lighting.`,
    aurora: `${short}. Aesthetic-forward scene, cohesive palette, intentional framing and soft cinematic light.`,
    "luma-photon": `Cinematic still of ${short}. Anamorphic feel, motivated lighting, atmospheric depth.`,
    "veo-2": `Cinematic shot: ${short}. Slow push-in, subtle subject motion, atmospheric lighting, short beat.`,
    "veo-3": `Cinematic sequence: ${short}. Motivated camera move, evolving light, coherent action arc, immersive ambience.`,
    "kling-1-6": `${short}. Camera tracks smoothly; subject moves with purpose; environment reacts; filmic motion blur.`,
    "kling-2": `${short}. Precise start-to-end motion, stable character look, dolly/orbit camera grammar, physics-aware action.`,
    "runway-gen3": `${short}. Locked framing then gentle dolly. Clear action beat. Moody grade.`,
    "runway-gen4": `${short}. Consistent subject appearance, deliberate camera move, single focused action, cinematic grade.`,
    sora: `A continuous shot of ${short}. Physically plausible motion, evolving light, immersive camera path.`,
    "pika-2": `${short}. Punchy motion, stylized energy, clear camera intent, short clip focus.`,
    hailuo: `${short}. Cinematic camera, natural character motion, atmospheric lighting, coherent single scene.`,
    "luma-dream-machine": `${short}. Dreamlike cinematic move, atmospheric haze, emotional lighting, fluid camera.`,
    "luma-ray2": `${short}. High-fidelity motion, continuous lighting, precise camera path, realistic physics.`,
    wan: `${short}. Clear subject action, simple camera move, temporally coherent scene.`,
    hitchiker: `${short}. Continuous cinematic action, defined camera path, strong mood and style.`,
  };

  if (templates[modelId]) return templates[modelId];

  const meta = getModel(modelId);
  if (meta?.category === "video") {
    return `Cinematic shot of ${short}. Clear camera move, subject motion, atmospheric lighting — tuned for ${meta.name}.`;
  }
  return `A detailed image of ${short}. Strong composition, intentional lighting and style — tuned for ${meta?.name ?? modelId}.`;
}

export function mockChatReply(opts: {
  messages: ChatMessage[];
  modelId: string;
  rewriteForModel?: boolean;
}): { text: string; prompt: string | null } {
  const lastUser = [...opts.messages].reverse().find((m) => m.role === "user");
  const brief = lastUser?.content?.trim() || "a cinematic portrait";
  const short = brief.length > 120 ? brief.slice(0, 117) + "…" : brief;
  const modelName = getModel(opts.modelId)?.name ?? opts.modelId;
  const prompt = demoPromptForModel(opts.modelId, short);

  const text = opts.rewriteForModel
    ? `**(Demo mode — no GEMINI_API_KEY)** Rewrote for **${modelName}**:\n\n\`\`\`prompt\n${prompt}\n\`\`\`\n\nTip: Add \`GEMINI_API_KEY\` for live Gemini chat + vision. Get a key at https://aistudio.google.com/apikey`
    : `**(Demo mode — no GEMINI_API_KEY)** Here's a starter prompt for **${modelName}**. Clarify mood, camera, and style for better results once Gemini is connected.\n\n\`\`\`prompt\n${prompt}\n\`\`\`\n\nSet \`GEMINI_API_KEY\` in your environment to unlock the full prompt engineer agent (clarifying questions, vision refs, model-specific rewrites).`;

  return { text, prompt };
}
