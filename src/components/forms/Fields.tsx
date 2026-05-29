const FIELD =
  "w-full rounded-card border border-hairline bg-transparent px-4 py-2.5 text-base text-current outline-none transition-colors focus:border-tungsten";

function Label({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-base text-muted">
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
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <Label label={label} required={required}>
      <select
        className={FIELD}
        name={name}
        required={required}
        defaultValue=""
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      >
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

export function Checkbox({ label, name, required }: { label: React.ReactNode; name: string; required?: boolean }) {
  return (
    <label className="flex items-start gap-3 text-base">
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

export function RadioGroup({
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
    <fieldset>
      <legend className="mb-2 block text-base text-muted">
        {label}
        {required && <span className="text-tungsten"> *</span>}
      </legend>
      <div className="space-y-2">
        {options.map((o, i) => (
          <label key={o} className="flex items-start gap-3 text-base text-current">
            {/* required on the first radio makes the whole same-name group required */}
            <input
              type="radio"
              name={name}
              value={o}
              required={required && i === 0}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-tungsten)]"
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Composite postal address. Emits flat `${prefix}_street`, `_line2`, `_city`, `_state`, `_zip`, `_country`. */
export function AddressGroup({ label, prefix, required }: { label: string; prefix: string; required?: boolean }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 block text-base text-muted">
        {label}
        {required && <span className="text-tungsten"> *</span>}
      </legend>
      <Field label="Street address" name={`${prefix}_street`} required={required} autoComplete="street-address" />
      <Field label="Suite / unit (optional)" name={`${prefix}_line2`} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="City" name={`${prefix}_city`} required={required} />
        <Field label="State / province" name={`${prefix}_state`} required={required} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="ZIP / postal code" name={`${prefix}_zip`} required={required} />
        <Field label="Country" name={`${prefix}_country`} placeholder="United States" />
      </div>
    </fieldset>
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
