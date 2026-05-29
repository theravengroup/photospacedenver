import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

type Shot = { src: string; alt: string };

/**
 * "Shot here" — a cinematic two-row marquee of real work shot on the floor.
 * Rows scroll in opposite directions at different speeds; the CSS marquee
 * (globals.css) handles hover-pause and prefers-reduced-motion. Each row's
 * frames are duplicated once so the -50% loop is seamless.
 */
export function ShotHereGallery({ shots }: { shots: Shot[] }) {
  const half = Math.ceil(shots.length / 2);
  const rowA = shots.slice(0, half);
  const rowB = shots.slice(half);

  return (
    <section className="surface-dark grain relative overflow-hidden py-[var(--spacing-section)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-24 h-[460px] w-[460px] rounded-full bg-[var(--color-tungsten)]/10 blur-[150px]"
      />

      <Container size="wide">
        <SectionHeading
          eyebrow="From the archive"
          title={
            <>
              Shot <span className="italic text-tungsten">here</span>.
            </>
          }
          intro="A small sample of the campaigns, editorials, and shoots booked, lit, and shot on this floor."
        />
      </Container>

      <div className="mask-fade-x relative mt-14 space-y-5 md:mt-20">
        <MarqueeRow shots={rowA} durationSec={55} heightClass="h-[280px] md:h-[420px]" />
        <MarqueeRow shots={rowB} reverse durationSec={72} heightClass="h-[240px] md:h-[360px]" />
      </div>

      <Container size="wide">
        <Reveal>
          <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-8 md:mt-24 md:flex-row md:items-baseline md:justify-between">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
              {String(shots.length).padStart(2, "0")} frames · the work continues
            </p>
            <p className="font-display text-2xl italic md:text-3xl">
              And every one of them was shot at photospace.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function MarqueeRow({
  shots,
  reverse = false,
  durationSec,
  heightClass,
}: {
  shots: Shot[];
  reverse?: boolean;
  durationSec: number;
  heightClass: string;
}) {
  const tape = [...shots, ...shots];

  return (
    <div className="marquee group/marquee overflow-hidden">
      <div
        className="marquee-track flex gap-5"
        style={{
          animationDuration: `${durationSec}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {tape.map((s, i) => (
          <figure
            key={`${s.src}-${i}`}
            className={`relative aspect-[4/5] ${heightClass} shrink-0 overflow-hidden rounded-card border border-hairline bg-white/[0.03] shadow-[0_22px_60px_-24px_rgba(0,0,0,0.65)]`}
          >
            <Image
              src={s.src}
              alt={i < shots.length ? s.alt : ""}
              aria-hidden={i >= shots.length}
              fill
              sizes="(min-width: 768px) 340px, 220px"
              className="object-cover transition-transform duration-700 ease-out group-hover/marquee:scale-[1.03]"
              draggable={false}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
