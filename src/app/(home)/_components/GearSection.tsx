import Link from "next/link";
import { SectionShell } from "./SectionShell";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";
import { GearCategoryCard } from "./GearCategoryCard";
import { ArrowIcon } from "./OutboundIcon";
import { GEAR_CATEGORIES } from "../_data/categories";
import { LINKS } from "../_data/site";

/**
 * The dominant operational section on the homepage.
 * Editorial 6-col grid alternating large/small emphasis for visual rhythm.
 */
export function GearSection() {
  // Pair the 8 categories into rows of (large, small) and (small, large)
  // for an alternating editorial layout.
  const pairs: Array<["large" | "small", "large" | "small"]> = [
    ["large", "small"],
    ["small", "large"],
    ["large", "small"],
    ["small", "large"],
  ];

  return (
    <SectionShell tone="paper" grain id="gear">
      <RevealOnScroll stagger className="mb-12 lg:mb-16">
        <div className="reveal">
          <SectionHeading
            eyebrow="Gear Rental"
            title={
              <>
                Professional gear rental
                <br />
                for Denver productions.
              </>
            }
            lead="Photographers, filmmakers, agencies, content teams, commercial productions — we keep the kit current, the workflow simple, and the production support local."
          />
        </div>
      </RevealOnScroll>

      <RevealOnScroll
        stagger
        className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-6 lg:gap-5"
      >
        {GEAR_CATEGORIES.map((category, i) => {
          const pairIndex = Math.floor(i / 2);
          const slotIndex = i % 2;
          const emphasis = pairs[pairIndex]?.[slotIndex] ?? "large";
          const colSpan =
            emphasis === "large"
              ? "lg:col-span-4"
              : "lg:col-span-2";

          return (
            <div key={category.slug} className={`reveal ${colSpan}`}>
              <GearCategoryCard category={category} emphasis={emphasis} />
            </div>
          );
        })}
      </RevealOnScroll>

      {/* Tail: "see all gear" link */}
      <RevealOnScroll className="mt-10 lg:mt-14">
        <div className="reveal flex flex-col items-start gap-4 border-t border-hair pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-stone max-w-[44ch]">
            Don&rsquo;t see your kit list?{" "}
            <span className="text-graphite font-medium">
              Send us what you need — we&rsquo;ll source, swap, or stage it.
            </span>
          </p>
          <Link
            href={LINKS.estimate}
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
          >
            <span className="border-b border-ink/40 pb-0.5 group-hover:border-ink transition-colors">
              Request an estimate
            </span>
            <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </RevealOnScroll>
    </SectionShell>
  );
}
