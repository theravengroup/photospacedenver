import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowIcon, OutboundIcon } from "./OutboundIcon";

type HeroPathwayCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
  variant: "image" | "type";
  image?: { src: string; alt: string };
  /** Optional list of supporting bullets shown beneath the description. */
  highlights?: ReadonlyArray<string>;
};

export function HeroPathwayCard({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  external = false,
  variant,
  image,
  highlights,
}: HeroPathwayCardProps) {
  const CardTag = external ? "a" : Link;
  const tagProps = external
    ? ({
        href: ctaHref,
        target: "_blank",
        rel: "noopener noreferrer",
      } as const)
    : ({ href: ctaHref } as const);

  return (
    <CardTag
      {...tagProps}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-sm",
        "bg-ink text-paper",
        "transition-transform duration-300 ease-out hover:-translate-y-0.5",
        "ring-1 ring-white/[0.04] hover:ring-white/[0.08]"
      )}
    >
      {/* Image variant */}
      {variant === "image" && image && (
        <div className="relative h-[260px] sm:h-[300px] lg:h-[340px] w-full overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/95" />
        </div>
      )}

      {/* Type variant — atmospheric, no image */}
      {variant === "type" && (
        <div
          className="relative h-[260px] sm:h-[300px] lg:h-[340px] w-full overflow-hidden bg-ink-grain"
          aria-hidden="true"
        >
          {/* Layered atmospheric gradient — feels lit rather than flat. */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_30%_20%,rgba(184,144,112,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_80%_90%,rgba(156,110,71,0.12),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/95 to-transparent" />

          {/* Decorative dot grid — sparse, restrained */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(244,241,234,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Large wordmark sitting in the negative space */}
          <div className="absolute bottom-6 left-6 right-6 flex items-baseline gap-2 leading-none">
            <span className="text-[clamp(2.5rem,5vw,3.75rem)] font-medium tracking-[-0.03em] text-paper">
              photospace
            </span>
            <span className="text-[0.625rem] uppercase tracking-[0.32em] text-fog">
              .studio
            </span>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex flex-1 flex-col justify-between gap-6 p-7 sm:p-9">
        <div>
          <p className="eyebrow eyebrow-light mb-4">{eyebrow}</p>
          <h3
            className="font-semibold text-paper"
            style={{
              fontSize: "var(--text-display-lg)",
              lineHeight: "var(--text-display-lg--line-height)",
              letterSpacing: "var(--text-display-lg--letter-spacing)",
            }}
          >
            {title}
          </h3>
          <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-fog">
            {description}
          </p>

          {highlights && (
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-fog">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="relative pl-3 before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-copper-soft"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-medium text-paper">
          <span className="border-b border-paper/40 pb-0.5 group-hover:border-paper transition-colors">
            {ctaLabel}
          </span>
          {external ? (
            <OutboundIcon className="text-paper" />
          ) : (
            <ArrowIcon className="text-paper transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </div>
      </div>
    </CardTag>
  );
}
