import { SignaturePad, type SignaturePadHandle } from "@/components/forms/SignaturePad";
import type { Info } from "./types";

type Props = {
  info: Info;
  sigRef: React.RefObject<SignaturePadHandle | null>;
  onChange: (empty: boolean) => void;
};

export function StepSignature({ info, sigRef, onChange }: Props) {
  const printed = `${info.firstName} ${info.lastName}`.trim() || "Your name";
  // This step only mounts after the user clicks through earlier steps (client
  // side, post-hydration), so reading the date here can't mismatch SSR.
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-tungsten">Step 3 of 4</p>
        <h2 className="font-display mt-2 text-display-md">Sign your name.</h2>
        <p className="mt-3 max-w-xl text-muted">
          Your signature confirms you&rsquo;ve read and agreed to every clause. Use a finger on touch, a stylus, or your mouse.
        </p>
      </header>

      <SignaturePad ref={sigRef} onChange={onChange} ariaLabel="Member signature" />

      <div className="grid gap-4 border-t border-hairline pt-6 sm:grid-cols-2 sm:gap-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Printed name</p>
          <p className="font-display mt-2 text-xl">{printed}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Date</p>
          <p className="font-display mt-2 text-xl">{today}</p>
        </div>
      </div>
    </div>
  );
}
