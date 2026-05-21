import { RevealOnScroll } from "./RevealOnScroll";
import { TESTIMONIALS } from "../_data/testimonials";

/**
 * Three editorial pull-quotes. No carousel — they sit still on the
 * page and let the words do the work. On mobile they stack; on
 * desktop they form a calm three-up.
 */
export function Testimonials() {
  return (
    <RevealOnScroll stagger>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <li key={t.attribution} className="reveal flex flex-col">
            <span
              aria-hidden="true"
              className="text-4xl leading-none text-copper/70 font-serif"
            >
              &ldquo;
            </span>
            <blockquote
              className="mt-3 text-lg leading-relaxed text-graphite"
              style={{ fontWeight: 450 }}
            >
              {t.quote}
            </blockquote>
            <footer className="mt-6 border-t border-hair pt-4">
              <p className="text-sm font-medium text-ink">{t.attribution}</p>
              {t.role && (
                <p className="text-sm text-stone">{t.role}</p>
              )}
            </footer>
          </li>
        ))}
      </ul>
    </RevealOnScroll>
  );
}
