const FIELD =
  "w-full rounded-card border border-hairline bg-transparent px-4 py-2.5 text-base text-foreground outline-none transition-colors focus:border-tungsten";

function Label({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">
        {label}
        {required && <span className="text-tungsten"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <Label label={label} required={required}>
      <input className={FIELD} name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} />
    </Label>
  );
}

export function TextArea({
  label,
  name,
  required,
  placeholder,
  rows = 5,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Label label={label} required={required}>
      <textarea className={FIELD} name={name} required={required} placeholder={placeholder} rows={rows} />
    </Label>
  );
}

export function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <Label label={label} required={required}>
      <select className={FIELD} name={name} required={required} defaultValue="">
        <option value="" disabled>
          Select&hellip;
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Label>
  );
}

export function Checkbox({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input
        type="checkbox"
        name={name}
        required={required}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-tungsten)]"
      />
      <span className="text-muted">{label}</span>
    </label>
  );
}

/** Hidden honeypot — bots fill it, humans don't. */
export function Honeypot() {
  return (
    <input
      type="text"
      name="company_website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] h-0 w-0 opacity-0"
    />
  );
}
