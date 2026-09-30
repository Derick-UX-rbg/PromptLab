export type ModelCategory = "image" | "video";

export interface ModelDef {
  id: string;
  name: string;
  category: ModelCategory;
  short: string;
  syntaxNotes: string;
}

export const MODELS: ModelDef[] = [
  // ── Image ──────────────────────────────────────────────────────────
  {
    id: "midjourney-v6",
    name: "Midjourney v6",
    category: "image",
    short: "MJ v6",
    syntaxNotes:
      "Descriptive natural language ending with Midjourney params: --ar, --stylize/--s, --v 6.1, --chaos, --style raw when useful. No (word:1.2) weight tags.",
  },
  {
    id: "midjourney-v7",
    name: "Midjourney v7",
    category: "image",
    short: "MJ v7",
    syntaxNotes:
      "Rich natural-language scene + Midjourney params (--ar, --stylize, --v 7, --chaos, --style raw). Favor coherent lighting and composition; avoid keyword soup and SD weight tags.",
  },
  {
    id: "flux",
    name: "Flux",
    category: "image",
    short: "Flux",
    syntaxNotes:
      "Natural language: subject + lighting + camera + style in prose. No Midjourney params. Prefer clear sentences over comma lists.",
  },
  {
    id: "flux-schnell",
    name: "Flux Schnell",
    category: "image",
    short: "Schnell",
    syntaxNotes:
      "Fast Flux variant: concise natural-language prompts. Lead with subject and action; add lighting/style briefly. No param flags.",
  },
  {
    id: "flux-pro",
    name: "Flux 1.1 Pro",
    category: "image",
    short: "Flux Pro",
    syntaxNotes:
      "High-fidelity Flux: detailed prose covering subject, materials, lighting, lens, and mood. Strong on photoreal and product. No MJ flags.",
  },
  {
    id: "flux-ultra",
    name: "Flux Ultra",
    category: "image",
    short: "Flux Ultra",
    syntaxNotes:
      "Maximum-detail Flux: elaborate natural language with texture, micro-contrast, and cinematic grade. Keep one coherent scene.",
  },
  {
    id: "sdxl",
    name: "SDXL",
    category: "image",
    short: "SDXL",
    syntaxNotes:
      "Comma-separated descriptors. Light (term:1.1–1.3) emphasis sparingly. Quality tokens OK; optionally suggest a short negative prompt separately.",
  },
  {
    id: "sd-3-5",
    name: "Stable Diffusion 3.5",
    category: "image",
    short: "SD 3.5",
    syntaxNotes:
      "Natural language or light comma lists. Strong prompt adherence — be specific on composition and text if any. Avoid heavy legacy SD1.5 token spam; light weights only if needed.",
  },
  {
    id: "gpt-image",
    name: "GPT Image",
    category: "image",
    short: "GPT Img",
    syntaxNotes:
      "Clear natural-language brief: composition, materials, lighting, style. No model param flags. Instructional phrasing works well.",
  },
  {
    id: "dalle-3",
    name: "DALL·E 3",
    category: "image",
    short: "DALL·E 3",
    syntaxNotes:
      "Full sentences describing the scene. Explicit about what to include/exclude. Good with text-in-image when quoted. No Midjourney params.",
  },
  {
    id: "ideogram",
    name: "Ideogram",
    category: "image",
    short: "Ideogram",
    syntaxNotes:
      "Excellent text-in-image: quote exact strings to render. Describe layout, typography vibe, and background clearly.",
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
    id: "gemini-image",
    name: "Gemini Image (Nano Banana)",
    category: "image",
    short: "Gemini Img",
    syntaxNotes:
      "Conversational but precise natural language. Describe subject, style, and edits clearly. Works well for iterative / reference-guided generation.",
  },
  {
    id: "leonardo",
    name: "Leonardo AI",
    category: "image",
    short: "Leonardo",
    syntaxNotes:
      "Descriptive prompt with style and medium. Can lean SD-like (comma lists + light weights) or prose depending on preset. Mention lighting and camera.",
  },
  {
    id: "firefly",
    name: "Adobe Firefly",
    category: "image",
    short: "Firefly",
    syntaxNotes:
      "Clear commercial-safe natural language. Subject, style, color mood, composition. Avoid celebrity/IP names; no MJ params.",
  },
  {
    id: "recraft",
    name: "Recraft",
    category: "image",
    short: "Recraft",
    syntaxNotes:
      "Strong for design/illustration/vector vibes. Specify style (flat, 3D, logo, mockup), color system, and exact text if needed.",
  },
  {
    id: "seedream",
    name: "Seedream",
    category: "image",
    short: "Seedream",
    syntaxNotes:
      "Detailed natural language or structured scene description. Emphasize aesthetics, lighting, and cultural/style cues. No MJ flags.",
  },
  {
    id: "grok-imagine",
    name: "Grok Imagine",
    category: "image",
    short: "Grok Img",
    syntaxNotes:
      "Direct natural-language image brief. Subject, style, mood, composition. Conversational clarity over param flags.",
  },
  {
    id: "aurora",
    name: "Aurora",
    category: "image",
    short: "Aurora",
    syntaxNotes:
      "Natural-language scene prompts with strong aesthetic direction. Lighting, palette, and composition matter; keep one clear subject focus.",
  },
  {
    id: "luma-photon",
    name: "Luma Photon",
    category: "image",
    short: "Photon",
    syntaxNotes:
      "Cinematic stills language: subject, lens, lighting, atmosphere. Prefer prose; optional reference-style cues. No MJ params.",
  },

  // ── Video ──────────────────────────────────────────────────────────
  {
    id: "veo-2",
    name: "Veo 2",
    category: "video",
    short: "Veo 2",
    syntaxNotes:
      "Motion + camera: shot type, camera move, subject action, lighting, mood. Keep a coherent short timeline.",
  },
  {
    id: "veo-3",
    name: "Veo 3",
    category: "video",
    short: "Veo 3",
    syntaxNotes:
      "Advanced Veo: rich cinematic prompt with camera path, subject motion, audio/ambience cues if useful, lighting evolution. One coherent beat or short sequence.",
  },
  {
    id: "kling-1-6",
    name: "Kling 1.6",
    category: "video",
    short: "Kling 1.6",
    syntaxNotes:
      "Subject motion, camera path, environment dynamics. Clear start→end action. Cinematic adjectives OK; avoid unrelated scene stacks.",
  },
  {
    id: "kling-2",
    name: "Kling 2",
    category: "video",
    short: "Kling 2",
    syntaxNotes:
      "Higher-fidelity Kling: precise motion beats, camera grammar (pan/tilt/dolly/orbit), physics-aware action, consistent character/wardrobe notes.",
  },
  {
    id: "runway-gen3",
    name: "Runway Gen-3",
    category: "video",
    short: "Gen-3",
    syntaxNotes:
      "Concise cinematic prompt: subject, action, camera, style. Strong motion cues. One primary action per clip.",
  },
  {
    id: "runway-gen4",
    name: "Runway Gen-4",
    category: "video",
    short: "Gen-4",
    syntaxNotes:
      "Gen-4: sharper subject consistency — describe character/object look, action, camera, and environment. Keep shots focused and coherent.",
  },
  {
    id: "sora",
    name: "Sora",
    category: "video",
    short: "Sora",
    syntaxNotes:
      "Rich scene with physics-aware motion, camera, lighting, and narrative beat. One coherent shot or short sequence.",
  },
  {
    id: "pika-2",
    name: "Pika 2",
    category: "video",
    short: "Pika 2",
    syntaxNotes:
      "Punchy cinematic prompt: subject + motion + camera. Can lean stylized/effects-forward. Keep duration intent short and clear.",
  },
  {
    id: "hailuo",
    name: "Hailuo (MiniMax)",
    category: "video",
    short: "Hailuo",
    syntaxNotes:
      "Cinematic natural language with clear camera and character motion. Describe shot size, movement, and atmosphere. Coherent single scene.",
  },
  {
    id: "luma-dream-machine",
    name: "Luma Dream Machine",
    category: "video",
    short: "Dream Machine",
    syntaxNotes:
      "Cinematic prose: subject, action, camera move, mood. Dream Machine responds well to film language and atmospheric detail.",
  },
  {
    id: "luma-ray2",
    name: "Luma Ray2",
    category: "video",
    short: "Ray2",
    syntaxNotes:
      "High-end Luma video: detailed camera grammar, realistic motion, lighting continuity. Prefer one clear action arc.",
  },
  {
    id: "wan",
    name: "Wan",
    category: "video",
    short: "Wan",
    syntaxNotes:
      "Describe scene, subject motion, and camera clearly in natural language. Keep beats simple and temporally coherent.",
  },
  {
    id: "hitchiker",
    name: "Hitchiker",
    category: "video",
    short: "Hitchiker",
    syntaxNotes:
      "Cinematic video brief: subject, motion, camera path, style. Emphasize continuous action and mood; avoid multi-scene mashups.",
  },
];

export function getModel(id: string): ModelDef | undefined {
  return MODELS.find((m) => m.id === id);
}

export const IMAGE_MODELS = MODELS.filter((m) => m.category === "image");
export const VIDEO_MODELS = MODELS.filter((m) => m.category === "video");
