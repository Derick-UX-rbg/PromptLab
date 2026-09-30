import Link from "next/link";
import { Nav } from "@/components/Nav";
import { MODELS } from "@/lib/models";
import { MessageSquare, Sparkles, ImageIcon, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Chat your brief",
    body: "Describe the look, mood, and subject. The agent asks clarifying questions when the brief is vague.",
  },
  {
    icon: Sparkles,
    title: "Pick a model",
    body: "Image or video — Midjourney, Flux, SDXL, Veo, Kling, Sora, and more. Syntax matches the target.",
  },
  {
    icon: ImageIcon,
    title: "Get the prompt",
    body: "Copy a final prompt block ready to paste. Optionally attach a reference image or video note.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen grid-bg">
      <Nav />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-card-border bg-card/80 px-3 py-1 text-xs font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Chat-first prompt engineering
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              From conversation to{" "}
              <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
                model-ready prompts
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted sm:text-xl">
              Prompt Lab is an AI agent that interviews your idea, then writes
              production prompts tuned for Midjourney, Flux, video models, and more.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-dim transition glow-ring"
              >
                Enter the Lab
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:border-accent/40 transition"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Preview card */}
          <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-card-border bg-card/90 p-1 glow-ring">
            <div className="rounded-xl bg-[#070a0e] p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2 text-xs text-muted">
                <span className="rounded bg-accent/15 px-2 py-0.5 text-accent">Agent</span>
                Midjourney · final prompt
              </div>
              <div className="prompt-block">
                {`cinematic portrait of a neon-lit street musician, rain-slick asphalt reflections, shallow depth of field, teal and amber grade --ar 3:4 --stylize 200 --v 6.1`}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-card-border bg-card/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">How it works</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted">
              Chat → pick model → get prompt. Optional reference upload for style lock-in.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-card-border bg-background/60 p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-accent">
                    Step {i + 1}
                  </p>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Models */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">
              Models we write for
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted">
              Image and video targets — each with its own syntax rules baked into the agent.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {MODELS.map((m) => (
                <span
                  key={m.id}
                  className="rounded-full border border-card-border bg-card px-4 py-2 text-sm text-foreground/90"
                >
                  <span className="mr-2 text-[10px] uppercase text-muted">
                    {m.category}
                  </span>
                  {m.name}
                </span>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-dim transition"
              >
                Start generating
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-card-border py-8 text-center text-sm text-muted">
        <p>
          Prompt Lab · Built for Derek Yigo ·{" "}
          <a
            href="https://github.com/Derick-UX-rbg"
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
