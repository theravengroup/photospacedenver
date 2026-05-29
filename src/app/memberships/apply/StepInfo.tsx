import { US_STATES } from "@/lib/content/membership-agreement";
import type { Info } from "./types";

const INPUT =
  "h-12 w-full rounded-card border border-hairline bg-transparent px-4 text-base text-current outline-none transition-colors focus:border-tungsten";

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

type Props = {
  info: Info;
  setField: <K extends keyof Info>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
};

export function StepInfo({ info, setField, setInfo }: Props) {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-tungsten">Step 1 of 4</p>
        <h2 className="font-display mt-2 text-display-md">Your information.</h2>
        <p className="mt-3 text-muted">
          Every field is required. We&rsquo;ll use this to set up your account and contact you when needed.
        </p>
      </header>

      <fieldset className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="firstName" label="First name *">
            <input id="firstName" className={INPUT} required autoComplete="given-name" value={info.firstName} onChange={setField("firstName")} />
          </Field>
          <Field id="lastName" label="Last name *">
            <input id="lastName" className={INPUT} required autoComplete="family-name" value={info.lastName} onChange={setField("lastName")} />
          </Field>
        </div>

        <Field id="business" label="Business name (optional)">
          <input id="business" className={INPUT} autoComplete="organization" value={info.business} onChange={setField("business")} />
        </Field>

        <Field id="street" label="Street address *">
          <input id="street" className={INPUT} required autoComplete="address-line1" value={info.street} onChange={setField("street")} />
        </Field>

        <Field id="street2" label="Address line 2 (optional)">
          <input id="street2" className={INPUT} autoComplete="address-line2" value={info.street2} onChange={setField("street2")} />
        </Field>

        <div className="grid gap-6 sm:grid-cols-[2fr_1fr_1fr]">
          <Field id="city" label="City *">
            <input id="city" className={INPUT} required autoComplete="address-level2" value={info.city} onChange={setField("city")} />
          </Field>
          <Field id="state" label="State *">
            <select
              id="state"
              required
              value={info.state}
              onChange={(e) => setInfo((s) => ({ ...s, state: e.target.value }))}
              className={INPUT}
            >
              <option value="">—</option>
              {US_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </Field>
          <Field id="zip" label="ZIP *">
            <input id="zip" className={INPUT} required inputMode="numeric" autoComplete="postal-code" value={info.zip} onChange={setField("zip")} />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="email" label="Email *">
            <input id="email" type="email" className={INPUT} required autoComplete="email" value={info.email} onChange={setField("email")} />
          </Field>
          <Field id="phone" label="Phone *">
            <input id="phone" type="tel" className={INPUT} required autoComplete="tel" value={info.phone} onChange={setField("phone")} />
          </Field>
        </div>
      </fieldset>
    </div>
  );
}
