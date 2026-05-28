import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import type { Faq } from "@/lib/content/faqs";

/**
 * Accessible, zero-JS FAQ accordion (native <details>). Emits FAQPage schema
 * by default — the rendered Q&As match the structured data exactly.
 */
export function FaqList({ faqs, includeSchema = true }: { faqs: Faq[]; includeSchema?: boolean }) {
  if (faqs.length === 0) return null;
  return (
    <div className="border-y border-hairline">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-hairline last:border-0">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <span
              aria-hidden
              className="shrink-0 text-xl leading-none text-tungsten transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="measure pb-6 text-muted">{f.a}</p>
        </details>
      ))}
      {includeSchema && <JsonLd data={faqSchema(faqs)} />}
    </div>
  );
}
