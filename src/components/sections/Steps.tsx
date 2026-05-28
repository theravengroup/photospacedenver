export type Step = { title: string; body: string };

/** Numbered "how it works" steps. */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className="font-display text-display-md text-tungsten">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-lg font-medium">{s.title}</h3>
          <p className="mt-2 text-sm text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
