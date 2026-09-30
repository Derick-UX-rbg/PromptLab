/** Client-safe prompt fence extractor (no Gemini imports). */
export function extractPromptBlock(text: string): string | null {
  const match = text.match(/```prompt\s*([\s\S]*?)```/i);
  if (match?.[1]) return match[1].trim();
  return null;
}
