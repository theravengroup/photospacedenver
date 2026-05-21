import Image from "next/image";
import Link from "next/link";
import type { GearCategory } from "../_data/categories";
import { ArrowIcon } from "./OutboundIcon";

type GearCategoryCardProps = {
  category: GearCategory;
  /** Visual emphasis tier — controls aspect ratio + type scale. */
  emphasis?: "large" | "small";
};

export function GearCategoryCard({
  category,
  emphasis = "large",
}: GearCategoryCardProps) {
  const aspectClass =
    emphasis === "large"
      ? "aspect-[4/3] lg:aspect-[5/4]"
      : "aspect-[4/5] lg:aspect-[4/5]";

  return (
    <Link
      href={category.href}
      className="group relative isolate flex flex-col overflow-hidden rounded-sm bg-ink ring-1 ring-white/[0.04] hover:ring-white/[0.10] transition-all"
    >
      <div className={`relative w-full ${aspectClass} bg-ink`}>
        {category.image ? (
          <>
            <Image
              src={category.image.src}
              alt={category.image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          </>
        ) : (
          // Type-forward variant for categories without imagery
          <div aria-hidden="true" className="absolute inset-0 bg-ink-grain">
            <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_30%_20%,rgba(184,144,112,0.16),transparent_60%)]" />
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(244,241,234,0.55) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-[clamp(2.5rem,5vw,4rem)] font-medium tracking-[-0.04em] text-paper/80"
              >
                {category.title.split(" ")[0]}
              </span>
            </div>
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
          <p className="eyebrow eyebrow-light mb-3">{category.slug.replace(/-/g, " · ")}</p>
          <h3
            className="font-semibold text-paper"
            style={{
              fontSize:
                emphasis === "large"
                  ? "var(--text-display-lg)"
                  : "1.5rem",
              lineHeight: 1.05,
              letterSpacing: "-0.018em",
            }}
          >
            {category.title}
          </h3>
          <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-fog">
            {category.blurb}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-paper">
            <span className="border-b border-paper/30 pb-0.5 group-hover:border-paper transition-colors">
              View {category.title.toLowerCase()}
            </span>
            <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
