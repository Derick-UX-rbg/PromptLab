"use client";

import { IMAGE_MODELS, VIDEO_MODELS, type ModelDef } from "@/lib/models";

export function ModelSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string, meta: ModelDef) => void;
}) {
  return (
    <div className="space-y-4">
      <Group
        label="Image"
        models={IMAGE_MODELS}
        selected={selected}
        onSelect={onSelect}
      />
      <Group
        label="Video"
        models={VIDEO_MODELS}
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  );
}

function Group({
  label,
  models,
  selected,
  onSelect,
}: {
  label: string;
  models: ModelDef[];
  selected: string;
  onSelect: (id: string, meta: ModelDef) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {models.map((m) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id, m)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-accent text-background"
                  : "border border-card-border bg-card text-foreground/80 hover:border-accent/40"
              }`}
            >
              {m.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
