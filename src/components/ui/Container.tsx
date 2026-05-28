import { cn } from "@/lib/cn";

type Size = "narrow" | "default" | "wide";

const MAX: Record<Size, string> = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[88rem]",
};

export function Container({
  size = "default",
  className,
  children,
}: {
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto w-full px-5 sm:px-8", MAX[size], className)}>{children}</div>;
}
