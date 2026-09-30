"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function PromptBlock({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-accent/30 bg-[#070a0e]">
      <div className="flex items-center justify-between border-b border-card-border px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
          Final prompt
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/25 transition"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="prompt-block border-0 rounded-none">{prompt}</pre>
    </div>
  );
}
