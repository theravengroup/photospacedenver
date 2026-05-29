import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { AGREEMENT_CLAUSES } from "@/lib/content/membership-agreement";

type Props = {
  agreements: Record<string, boolean>;
  setAgreements: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};

function AgreeToggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        checked
          ? "border-tungsten bg-tungsten text-ink"
          : "border-hairline text-muted hover:border-tungsten hover:text-ink",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex size-4 items-center justify-center rounded-full border text-[10px]",
          checked ? "border-ink/40 bg-ink/10 text-ink" : "border-current",
        )}
      >
        {checked ? "✓" : ""}
      </span>
      {checked ? "Agreed" : "I agree"}
    </button>
  );
}

export function StepAgreements({ agreements, setAgreements }: Props) {
  const count = AGREEMENT_CLAUSES.length;
  const done = AGREEMENT_CLAUSES.filter((c) => agreements[c.id]).length;
  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-tungsten">Step 2 of 4</p>
          <h2 className="font-display mt-2 text-display-md">Membership agreement.</h2>
          <p className="mt-3 max-w-xl text-muted">
            Please read each clause and toggle <strong className="font-semibold text-ink">I agree</strong>. All {count} are required.
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl">
            {done}
            <span className="text-muted">/{count}</span>
          </p>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Agreed</p>
        </div>
      </header>

      <ol className="divide-y divide-[var(--hairline)] border-y border-hairline">
        {AGREEMENT_CLAUSES.map((c, i) => {
          const checked = !!agreements[c.id];
          return (
            <li key={c.id} className="py-7">
              <div className="grid gap-5 md:grid-cols-[auto_1fr] md:gap-7">
                <span className="font-mono text-[11px] tabular-nums text-muted md:pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium md:text-2xl">{c.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.body}</p>
                  <div className="mt-5">
                    <AgreeToggle
                      id={`agree-${c.id}`}
                      checked={checked}
                      onChange={(v) => setAgreements((s) => ({ ...s, [c.id]: v }))}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-3 rounded-card border border-hairline bg-panel p-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">Agree to all in one go (you can still uncheck any clause above).</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const all: Record<string, boolean> = {};
            AGREEMENT_CLAUSES.forEach((c) => (all[c.id] = true));
            setAgreements(all);
          }}
        >
          Agree to all
        </Button>
      </div>
    </div>
  );
}
