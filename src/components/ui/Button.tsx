import Link from "next/link";
import { cn } from "@/lib/cn";

export type CtaTracking = {
  location?: string;
  type?: string;
  page?: string;
  service?: string;
  event?: string;
};

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-300 ease-cinematic disabled:opacity-50";

const SIZES: Record<Size, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-4",
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-tungsten text-ink hover:bg-tungsten-soft",
  outline: "border border-hairline text-current hover:border-tungsten hover:text-tungsten",
  ghost: "text-current underline underline-offset-4 decoration-1 hover:text-tungsten",
};

export type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  tracking?: CtaTracking;
  newTab?: boolean;
  ariaLabel?: string;
  /** For the <button> element (no href). */
  type?: "button" | "submit";
  disabled?: boolean;
};

function trackingAttrs(t?: CtaTracking) {
  if (!t) return {};
  return {
    "data-cta-location": t.location,
    "data-cta-type": t.type,
    "data-page": t.page,
    "data-service": t.service,
    "data-event": t.event,
  };
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  tracking,
  newTab,
  ariaLabel,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = cn(BASE, SIZES[size], VARIANTS[variant], className);
  const attrs = trackingAttrs(tracking);

  if (!href) {
    return (
      <button type={type} disabled={disabled} className={classes} aria-label={ariaLabel} {...attrs}>
        {children}
      </button>
    );
  }

  const isInternal = href.startsWith("/") && !href.startsWith("//");
  if (isInternal) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel} {...attrs}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...attrs}
    >
      {children}
    </a>
  );
}
