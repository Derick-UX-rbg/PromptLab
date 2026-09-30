import Link from "next/link";

export function Nav({ solid = false }: { solid?: boolean }) {
  return (
    <header
      className={`sticky top-0 z-40 border-b border-card-border/80 ${
        solid ? "bg-background" : "bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-bold">
            PL
          </span>
          <span>
            Prompt <span className="text-accent">Lab</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/#how"
            className="hidden text-muted hover:text-foreground transition sm:inline"
          >
            How it works
          </Link>
          <Link
            href="/lab"
            className="rounded-full bg-accent px-4 py-1.5 font-medium text-background hover:bg-accent-dim transition"
          >
            Open Lab
          </Link>
        </nav>
      </div>
    </header>
  );
}
