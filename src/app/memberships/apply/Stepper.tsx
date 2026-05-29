import { cn } from "@/lib/cn";
import { steps, type Step } from "./types";

export function Stepper({ current }: { current: Step }) {
  return (
    <ol className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.id} className="flex items-center gap-3">
            <span className={cn("inline-flex items-center gap-2", active && "text-ink", done && "text-tungsten")}>
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-full border text-[10px] font-medium tabular-nums",
                  active
                    ? "border-ink bg-ink text-bone"
                    : done
                      ? "border-tungsten bg-tungsten text-ink"
                      : "border-hairline text-muted",
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              {s.label}
            </span>
            {i < steps.length - 1 && <span aria-hidden className="h-px w-6 bg-hairline md:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}
