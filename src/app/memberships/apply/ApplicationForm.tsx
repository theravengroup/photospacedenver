"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { type SignaturePadHandle } from "@/components/forms/SignaturePad";
import { AGREEMENT_CLAUSES } from "@/lib/content/membership-agreement";
import { submitApplication } from "./actions";
import { Stepper } from "./Stepper";
import { StepInfo } from "./StepInfo";
import { StepAgreements } from "./StepAgreements";
import { StepSignature } from "./StepSignature";
import { StepPayment } from "./StepPayment";
import { blankInfo, type Info, type Step } from "./types";

export function ApplicationForm() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [info, setInfo] = useState<Info>(blankInfo);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [sigEmpty, setSigEmpty] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const sigRef = useRef<SignaturePadHandle>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const setField =
    <K extends keyof Info>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setInfo((s) => ({ ...s, [key]: e.target.value }));

  const allAgreed = useMemo(
    () => AGREEMENT_CLAUSES.every((c) => agreements[c.id]) && AGREEMENT_CLAUSES.length > 0,
    [agreements],
  );

  const infoValid = useMemo(
    () =>
      Boolean(
        info.firstName.trim() &&
          info.lastName.trim() &&
          info.street.trim() &&
          info.city.trim() &&
          info.state.trim() &&
          info.zip.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email) &&
          info.phone.replace(/\D/g, "").length >= 10,
      ),
    [info],
  );

  const goTo = (s: Step) => {
    setStep(s);
    requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  };

  const advance = async () => {
    setSubmitError(null);
    if (step === 0) {
      if (!infoValid) return setSubmitError("Please complete every required field.");
      return goTo(1);
    }
    if (step === 1) {
      if (!allAgreed) return setSubmitError("Please agree to every clause to continue.");
      return goTo(2);
    }
    if (step === 2) {
      if (sigEmpty || sigRef.current?.isEmpty()) return setSubmitError("Please sign before continuing.");
      setSubmitting(true);
      const signature = sigRef.current?.toDataURL() ?? "";
      const form = new FormData();
      Object.entries(info).forEach(([k, v]) => form.append(k, v));
      form.append("agreements", JSON.stringify(agreements));
      form.append("signature", signature);
      const result = await submitApplication(form);
      setSubmitting(false);
      if (!result.ok) return setSubmitError(result.error ?? "Could not submit your application.");
      return goTo(3);
    }
  };

  return (
    <div ref={formTopRef} className="space-y-10 scroll-mt-28">
      <Stepper current={step} />

      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-card border border-hairline bg-panel p-7 md:p-10"
        >
          {step === 0 && <StepInfo info={info} setField={setField} setInfo={setInfo} />}
          {step === 1 && <StepAgreements agreements={agreements} setAgreements={setAgreements} />}
          {step === 2 && <StepSignature info={info} sigRef={sigRef} onChange={(empty) => setSigEmpty(empty)} />}
          {step === 3 && <StepPayment />}
        </motion.section>
      </AnimatePresence>

      {submitError && step !== 3 && (
        <p className="rounded-card border border-studio-red/30 bg-studio-red/5 p-4 text-sm text-studio-red">{submitError}</p>
      )}

      {step !== 3 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => step > 0 && goTo((step - 1) as Step)}
            disabled={step === 0 || submitting}
            className={cn(step === 0 && "invisible")}
          >
            &larr; Back
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={advance}
            disabled={submitting || (step === 0 && !infoValid) || (step === 1 && !allAgreed) || (step === 2 && sigEmpty)}
          >
            {submitting
              ? "Saving…"
              : step === 0
                ? "Continue to agreement →"
                : step === 1
                  ? "Continue to signature →"
                  : "Sign & Continue to payment →"}
          </Button>
        </div>
      )}
    </div>
  );
}
