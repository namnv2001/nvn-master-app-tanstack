import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  component: NotFound,
})

function NotFound() {
  return (
    <div className="flex flex-col items-start gap-6 py-12">
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
          404 — Page not found
        </p>
        <h1 className="font-serif text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] font-bold">
          Lost in the void.
        </h1>
      </div>

      <p className="text-[15px] leading-[1.7] text-muted font-light max-w-sm">
        This page doesn't exist or was moved. Let's get you back somewhere
        useful.
      </p>

      <Link
        to="/"
        className="font-mono text-[13px] border-b border-foreground pb-px text-foreground hover:text-muted hover:border-muted transition-colors"
      >
        ← back to home
      </Link>
    </div>
  )
}
