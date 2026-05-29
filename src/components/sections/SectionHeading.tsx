import { cn } from "@/lib/cn";
import { brand } from "@/lib/brand";

type As = "h1" | "h2" | "h3";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  as = "h2",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  as?: As;
  align?: "left" | "center";
  className?: string;
}) {
  const Title = as;
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Title
        className={cn(
          "font-display",
          as === "h1" ? "text-display-xl" : "text-display-lg",
          eyebrow && "mt-3",
        )}
      >
        {title}
      </Title>
      {intro && (
        <p className={cn("mt-4 text-lg text-muted", align === "center" ? "mx-auto measure" : "measure")}>
          {brand(intro)}
        </p>
      )}
    </div>
  );
}
