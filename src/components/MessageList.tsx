"use client";

import { PromptBlock } from "./PromptBlock";

export interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  prompt?: string | null;
  attachmentLabel?: string | null;
}

function renderAssistant(content: string, prompt?: string | null) {
  // Strip ```prompt``` fences from visible prose; show PromptBlock separately.
  const cleaned = content.replace(/```prompt\s*[\s\S]*?```/gi, "").trim();
  return (
    <>
      {cleaned ? <div className="msg-prose text-sm">{cleaned}</div> : null}
      {prompt ? <PromptBlock prompt={prompt} /> : null}
    </>
  );
}

export function MessageList({ messages }: { messages: UiMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-medium text-foreground/90">Describe what you want to make</p>
        <p className="mt-2 max-w-md text-sm text-muted">
          Pick a model, chat your brief, optionally attach a reference. The agent will clarify,
          then deliver a copy-ready prompt.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              m.role === "user"
                ? "bg-accent/20 text-foreground border border-accent/20"
                : "bg-card border border-card-border"
            }`}
          >
            {m.role === "user" ? (
              <>
                <div className="msg-prose text-sm">{m.content}</div>
                {m.attachmentLabel ? (
                  <p className="mt-2 text-[11px] text-accent">{m.attachmentLabel}</p>
                ) : null}
              </>
            ) : (
              renderAssistant(m.content, m.prompt)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
