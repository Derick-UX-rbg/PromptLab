export type ModelCategory = "image" | "video";

export interface ModelDef {
  id: string;
  name: string;
  category: ModelCategory;
  short: string;
  syntaxNotes: string;
}

export const MODELS: ModelDef[] = [
  {
    id: "midjourney",
    name: "Midjourney",
    category: "image",
    short: "MJ",
    syntaxNotes:
      "Use descriptive natural language ending with Midjourney parameters: --ar (aspect), --stylize/--s, --v, --chaos, --style raw when useful. No weight tags like (word:1.2).",
  },
  {
    id: "flux",
    name: "Flux",
    category: "image",
    short: "Flux",
    syntaxNotes:
      "Natural language, clear subject + lighting + camera + style. Prefer prose over keyword soup. No Midjourney params.",
  },
  {
    id: "sdxl",
    name: "SDXL",
    category: "image",
    short: "SDXL",
    syntaxNotes:
      "Comma-separated descriptors. Light emphasis with (term:1.1–1.3) sparingly. Include quality tokens and a short negative-prompt suggestion separately if helpful.",
  },
  {
    id: "gpt-image",
    name: "GPT Image",
    category: "image",
    short: "GPT Img",
    syntaxNotes:
      "Clear, specific natural-language brief. Describe composition, materials, lighting. Avoid model-specific param flags.",
  },
  {
    id: "ideogram",
    name: "Ideogram",
    category: "image",
    short: "Ideogram",
    syntaxNotes:
      "Strong on text-in-image. Quote exact text to render. Describe layout, typography vibe, and background clearly.",
  },
  {
    id: "imagen",
    name: "Imagen",
    category: "image",
    short: "Imagen",
    syntaxNotes:
      "Photographic / cinematic natural language. Subject, setting, lighting, lens feel. No MJ-style flags.",
  },
  {
    id: "veo",
    name: "Veo",
    category: "video",
    short: "Veo",
    syntaxNotes:
      "Motion + camera language: shot type, camera move, subject action, lighting, duration feel, mood. Keep coherent timeline.",
  },
  {
    id: "kling",
    name: "Kling",
    category: "video",
    short: "Kling",
    syntaxNotes:
      "Describe subject motion, camera path, environment dynamics. Clear start→end action beats. Cinematic adjectives OK.",
  },
  {
    id: "runway",
    name: "Runway",
    category: "video",
    short: "Runway",
    syntaxNotes:
      "Concise cinematic prompt: subject, action, camera, style. Optional motion cues. Avoid stacking unrelated scenes.",
  },
  {
    id: "sora",
    name: "Sora",
    category: "video",
    short: "Sora",
    syntaxNotes:
      "Rich scene description with physics-aware motion, camera, lighting, and narrative beat. One coherent shot or short sequence.",
  },
];

export function getModel(id: string): ModelDef | undefined {
  return MODELS.find((m) => m.id === id);
}

export const IMAGE_MODELS = MODELS.filter((m) => m.category === "image");
export const VIDEO_MODELS = MODELS.filter((m) => m.category === "video");
