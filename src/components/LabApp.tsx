"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ImagePlus,
  Loader2,
  Paperclip,
  Send,
  Video,
  X,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { MessageList, type UiMessage } from "./MessageList";
import { getModel, type ModelDef } from "@/lib/models";
import { extractPromptBlock } from "@/lib/extract-prompt";
import type { ChatMessage, ChatResponseBody } from "@/lib/types";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function fileToBase64(file: File): Promise<{ base64: string; mime: string }> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  const base64 = btoa(binary);
  return { base64, mime: file.type || "image/png" };
}

/** Grab first frame from a short video as JPEG data URL (client-side). */
async function videoFirstFrame(file: File): Promise<{ base64: string; mime: string } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = url;
    video.onloadeddata = () => {
      try {
        video.currentTime = Math.min(0.1, (video.duration || 1) * 0.05);
      } catch {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(null);
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64 = dataUrl.replace(/^data:[^;]+;base64,/, "");
        URL.revokeObjectURL(url);
        resolve({ base64, mime: "image/jpeg" });
      } catch {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
  });
}

export function LabApp() {
  const [modelId, setModelId] = useState("midjourney-v7");
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [geminiOk, setGeminiOk] = useState<boolean | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [rewriteOffer, setRewriteOffer] = useState<{
    from: string;
    to: string;
    toName: string;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const lastPromptRef = useRef<string | null>(null);
  const prevModelRef = useRef(modelId);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d: { geminiConfigured: boolean }) => setGeminiOk(d.geminiConfigured))
      .catch(() => setGeminiOk(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const onModelSelect = useCallback(
    (id: string, meta: ModelDef) => {
      const prev = prevModelRef.current;
      setModelId(id);
      prevModelRef.current = id;
      if (prev !== id && lastPromptRef.current) {
        setRewriteOffer({ from: prev, to: id, toName: meta.name });
      }
    },
    []
  );

  function clearAttachments() {
    setImageFile(null);
    setImagePreview(null);
    setVideoFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  }

  async function onImagePick(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function onVideoPick(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("video/")) return;
    setVideoFile(file);
  }

  async function sendMessage(opts?: {
    text?: string;
    rewrite?: boolean;
    forceModelId?: string;
  }) {
    const text = (opts?.text ?? input).trim();
    if (!text && !opts?.rewrite) return;
    if (loading) return;

    const mid = opts?.forceModelId ?? modelId;
    setRewriteOffer(null);
    setLoading(true);

    const attachmentParts: string[] = [];
    if (imageFile) attachmentParts.push(`🖼 ${imageFile.name}`);
    if (videoFile) attachmentParts.push(`🎬 ${videoFile.name}`);

    const userContent =
      opts?.rewrite && lastPromptRef.current
        ? `Please rewrite this prompt for ${getModel(mid)?.name ?? mid}:\n\n${lastPromptRef.current}`
        : text;

    const userMsg: UiMessage = {
      id: uid(),
      role: "user",
      content: userContent,
      attachmentLabel: attachmentParts.length ? attachmentParts.join(" · ") : null,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!opts?.rewrite) setInput("");

    // Build API payload
    const apiMessages: ChatMessage[] = nextMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let imageBase64: string | null = null;
    let imageMimeType: string | null = null;
    let videoNote: string | null = null;

    try {
      if (imageFile) {
        const { base64, mime } = await fileToBase64(imageFile);
        imageBase64 = base64;
        imageMimeType = mime;
      } else if (videoFile) {
        videoNote = `Filename: ${videoFile.name}; size≈${Math.round(videoFile.size / 1024)}KB; type=${videoFile.type}`;
        const frame = await videoFirstFrame(videoFile);
        if (frame) {
          imageBase64 = frame.base64;
          imageMimeType = frame.mime;
          videoNote += "; first-frame still attached for vision.";
        }
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          modelId: mid,
          imageBase64,
          imageMimeType,
          videoNote,
          rewriteForModel: Boolean(opts?.rewrite),
        }),
      });

      const data = (await res.json()) as ChatResponseBody;
      const assistantText = data.message || data.error || "No response.";
      const prompt =
        data.prompt ?? extractPromptBlock(assistantText) ?? null;
      if (prompt) lastPromptRef.current = prompt;

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: assistantText,
          prompt,
        },
      ]);
      clearAttachments();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: `Failed to reach the chat API: ${msg}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-card-border px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-bold">
              PL
            </span>
            <span className="hidden sm:inline">
              Prompt <span className="text-accent">Lab</span>
            </span>
          </Link>
          <span className="hidden text-xs text-muted md:inline">
            {getModel(modelId)?.name ?? modelId}
          </span>
        </div>
        {geminiOk === false && (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] text-amber-200">
            <AlertTriangle className="h-3 w-3" />
            Demo mode — set GEMINI_API_KEY
          </div>
        )}
        {geminiOk === true && (
          <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] text-accent">
            Gemini connected
          </div>
        )}
      </header>

      {geminiOk === false && (
        <div className="border-b border-amber-500/20 bg-amber-500/5 px-4 py-2 text-center text-xs text-amber-100/90">
          Add <code className="text-accent">GEMINI_API_KEY</code> to your env (local{" "}
          <code>.env.local</code> or Render) for live chat + vision. UI works in demo mode
          without it.{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline"
          >
            Get a key
          </a>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Sidebar models */}
        <aside className="shrink-0 border-b border-card-border p-4 md:w-56 md:border-b-0 md:border-r md:overflow-y-auto scrollbar-thin">
          <p className="mb-3 text-xs font-semibold text-foreground">Target model</p>
          <ModelSelector selected={modelId} onSelect={onModelSelect} />
        </aside>

        {/* Chat */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {rewriteOffer && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-accent/20 bg-accent/5 px-4 py-2 text-sm">
              <span className="text-muted">
                Switch to <strong className="text-accent">{rewriteOffer.toName}</strong>? Rewrite
                last prompt for the new model.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-background"
                  onClick={() =>
                    sendMessage({
                      rewrite: true,
                      forceModelId: rewriteOffer.to,
                    })
                  }
                >
                  <RefreshCw className="h-3 w-3" />
                  Rewrite
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-card-border px-3 py-1 text-xs text-muted"
                  onClick={() => setRewriteOffer(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <MessageList messages={messages} />
            {loading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                Crafting…
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-card-border p-3 sm:p-4">
            {(imagePreview || videoFile) && (
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {imagePreview && (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Reference"
                      className="h-14 w-14 rounded-lg object-cover border border-card-border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        if (imageInputRef.current) imageInputRef.current.value = "";
                      }}
                      className="absolute -right-1.5 -top-1.5 rounded-full bg-card border border-card-border p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {videoFile && (
                  <div className="flex items-center gap-2 rounded-lg border border-card-border bg-card px-2 py-1.5 text-xs">
                    <Video className="h-3.5 w-3.5 text-accent" />
                    <span className="max-w-[140px] truncate">{videoFile.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        if (videoInputRef.current) videoInputRef.current.value = "";
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage();
              }}
            >
              <div className="flex gap-1">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void onImagePick(e.target.files?.[0] ?? null)}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => void onVideoPick(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  title="Attach image"
                  onClick={() => imageInputRef.current?.click()}
                  className="rounded-xl border border-card-border p-2.5 text-muted hover:text-accent hover:border-accent/40 transition"
                >
                  <ImagePlus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Attach video (first frame + notes)"
                  onClick={() => videoInputRef.current?.click()}
                  className="rounded-xl border border-card-border p-2.5 text-muted hover:text-accent hover:border-accent/40 transition"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage();
                  }
                }}
                rows={1}
                placeholder="Describe the image or video you want…"
                className="max-h-32 min-h-[42px] flex-1 resize-y rounded-xl border border-card-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent/50 placeholder:text-muted/60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex h-[42px] items-center gap-1.5 rounded-xl bg-accent px-4 text-sm font-semibold text-background disabled:opacity-40 hover:bg-accent-dim transition"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
