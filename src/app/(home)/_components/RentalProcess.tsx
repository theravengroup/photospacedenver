import { SectionShell } from "./SectionShell";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";
import { PROCESS_STEPS } from "../_data/process";

export function RentalProcess() {
  return (
    <SectionShell tone="paper" id="process">
      <RevealOnScroll className="mb-12 lg:mb-16">
        <div className="reveal max-w-[44rem]">
          <SectionHeading
            eyebrow="How it works"
            title="A simple, calm rental process."
            lead="No surprises, no hold music. Here's exactly what happens from the first message to the return."
          />
        </div>
      </RevealOnScroll>

      <RevealOnScroll
        stagger
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4"
      >
        {PROCESS_STEPS.map((step, i) => (
          <article
            key={step.index}
            className="reveal relative flex flex-col gap-4 border-t border-hair pt-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs tracking-[0.18em] text-copper">
                {step.index}
              </span>
              {i < PROCESS_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden lg:block absolute top-0 right-0 h-px w-4 bg-hair translate-y-[-0.5px]"
                />
              )}
            </div>
            <h3 className="text-lg font-semibold text-ink leading-snug">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-stone">{step.body}</p>
          </article>
        ))}
      </RevealOnScroll>
    </SectionShell>
  );
}
