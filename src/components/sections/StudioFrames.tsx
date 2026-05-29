import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

/** "Inside the studio" — four frames, faithful to photospace.studio. Shared by
 *  /studio and the studio SEO landing pages. */
const FRAMES = [
  {
    numeral: "I",
    label: "The Stage",
    headline: "1,900 ft² of light.",
    body: "A real cyclorama. Individual controllable blinds on giant windows. A floor that's been swept, mopped, and re-painted between every campaign. No mystery cables, no broken outlets, no excuses.",
    img: "/images/space/stage.jpg",
    alt: "The 1,900 ft² shooting floor and cyclorama wall",
  },
  {
    numeral: "II",
    label: "The Entry",
    headline: "A bookshop before a shoot.",
    body: "Hand-scraped teak treads, steel railings, leather chairs, and a curated library of editorial references — design monographs, photo books, magazines your art director will recognize. The first room every visitor walks through, and where the day starts to feel like a campaign.",
    img: "/images/space/entry.jpg",
    alt: "The entry library with teak stairs and editorial reference shelves",
  },
  {
    numeral: "III",
    label: "The Lounge",
    headline: "Where the conversation happens.",
    body: "A sofa that clients want to sit on. A second monitor at the tether station for art directors. Espresso that's better than fine. The studio that turns a six-hour shoot from a marathon into a conversation.",
    img: "/images/space/lounge.jpg",
    alt: "The client lounge with sofa and a tether-station monitor",
  },
  {
    numeral: "IV",
    label: "The Building",
    headline: "Yours, midnight or sunrise.",
    body: "209 Kalamath St, Unit 1. Free parking, a load-in ramp, an outdoor deck, and a real working kitchen. Easy in, easy out, midnight or sunrise — the studio is yours when the work is.",
    img: "/images/space/kitchen.jpg",
    alt: "The working kitchen and lounge at photospace",
  },
];

export function StudioFrames() {
  return (
    <Section tone="dark" className="grain" containerSize="wide">
      <SectionHeading
        eyebrow="Inside the studio"
        title="Four frames of what you get when you walk in."
        intro="Scroll to read the whole story — the stage, the entry, the lounge, and the building that holds them."
      />
      <div className="mt-14 space-y-16 lg:space-y-24">
        {FRAMES.map((f, i) => (
          <Reveal key={f.numeral} className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-card border border-hairline ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <Image
                src={f.img}
                alt={f.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <p className="font-display text-display-md text-tungsten">{f.numeral}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">{f.label}</p>
              <h3 className="font-display mt-3 text-display-lg">{f.headline}</h3>
              <p className="mt-4 text-muted">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
