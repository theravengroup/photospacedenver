"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Zap,
  Sun,
  Aperture,
  Plug,
  Video,
  Package,
  Building2,
  Tag,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  FileText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/NavigationMenu";
import { MEMBERSHIP_TIERS } from "@/lib/content/pricing-data";

/** Gear categories surfaced in the mega menu — icon + short, accurate descriptor. */
const GEAR_CATEGORIES: { href: string; label: string; desc: string; icon: LucideIcon }[] = [
  { href: "/camera-lens-rental-denver", label: "Cameras & Lenses", desc: "Phase One, Canon, Nikon, Fuji", icon: Camera },
  { href: "/flash-strobe-rental-denver", label: "Flash Lighting", desc: "Profoto strobes & speedlights", icon: Zap },
  { href: "/continuous-lighting-rental-denver", label: "Continuous Lighting", desc: "Arri, Nanlux, Aputure LED", icon: Sun },
  { href: "/lighting-modifier-rental-denver", label: "Lighting Modifiers", desc: "Softboxes, octas, parabolics", icon: Aperture },
  { href: "/grip-equipment-rental-denver", label: "Grip & Electrical", desc: "C-stands, flags, booms, power", icon: Plug },
  { href: "/photo-video-accessory-rental-denver", label: "Photo & Video Accessories", desc: "Gimbals, sliders, audio", icon: Video },
  { href: "/production-supply-rental-denver", label: "Production Supplies", desc: "Tents, generators, comms", icon: Package },
];

const STUDIO_LINKS: { href: string; label: string; desc: string; icon: LucideIcon }[] = [
  { href: "/studio", label: "The Studio", desc: "A real cyclorama, controllable daylight, 24/7 access.", icon: Building2 },
  { href: "/studio-pricing", label: "Studio Pricing", desc: "Hourly, half-day & full-day rates.", icon: Tag },
  { href: "/book-studio", label: "Book the Studio", desc: "Reserve your time — same rate, day or night.", icon: CalendarCheck },
];

const MIN_MEMBER_PRICE = Math.min(...MEMBERSHIP_TIERS.map((t) => t.price));

function MenuRow({ href, label, desc, icon: Icon }: { href: string; label: string; desc?: string; icon: LucideIcon }) {
  return (
    <NavigationMenuLink asChild>
      <Link href={href} className="group/row flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.06]">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-hairline bg-white/[0.03] text-tungsten transition-colors group-hover/row:border-tungsten/40">
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-bone">{label}</span>
          {desc && <span className="mt-0.5 block text-xs text-muted">{desc}</span>}
        </span>
      </Link>
    </NavigationMenuLink>
  );
}

function FeatureCard({ href, src, alt, eyebrow, title, cta }: { href: string; src: string; alt: string; eyebrow: string; title: string; cta: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link href={href} className="group/feat relative flex min-h-[210px] flex-col justify-end overflow-hidden rounded-card border border-hairline">
        <Image src={src} alt={alt} fill sizes="380px" className="object-cover opacity-70 transition-transform duration-700 ease-out group-hover/feat:scale-105" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
        <div className="relative p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-tungsten">{eyebrow}</p>
          <p className="font-display mt-1 text-xl text-bone">{title}</p>
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-bone/90">
            {cta} <ArrowRight className="size-3.5 transition-transform group-hover/feat:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

function SideLink({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <NavigationMenuLink asChild>
      <Link href={href} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-bone/85 transition-colors hover:bg-white/[0.04] hover:text-bone focus-visible:bg-white/[0.06]">
        <Icon className="size-4 text-tungsten" aria-hidden />
        {label}
      </Link>
    </NavigationMenuLink>
  );
}

export function MegaMenu({ className }: { className?: string }) {
  return (
    <NavigationMenu className={className} aria-label="Primary">
      <NavigationMenuList>
        {/* Studio */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Studio</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[min(800px,92vw)] grid-cols-[1.05fr_1fr] gap-5 p-6">
              <FeatureCard
                href="/studio"
                src="/images/space/stage.jpg"
                alt="The 1,900 ft² shooting floor and cyclorama wall"
                eyebrow="The Studio"
                title="A real working studio."
                cta="Explore the studio"
              />
              <div className="flex flex-col justify-center gap-1">
                {STUDIO_LINKS.map((l) => (
                  <MenuRow key={l.href} {...l} />
                ))}
                <NavigationMenuLink asChild>
                  <Link
                    href="/memberships"
                    className="group/mem mt-2 flex items-center gap-3 rounded-lg border border-tungsten/30 bg-tungsten/[0.06] p-3 transition-colors hover:border-tungsten/50 focus-visible:border-tungsten/50"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-tungsten/30 text-tungsten">
                      <Sparkles className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-bone">Memberships</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        Studio access at member rates — from ${MIN_MEMBER_PRICE}/mo.
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-tungsten transition-transform group-hover/mem:translate-x-0.5" aria-hidden />
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Gear */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gear</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[min(920px,94vw)] grid-cols-[1.7fr_1fr] gap-5 p-6">
              <div>
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Rent by category</p>
                  <NavigationMenuLink asChild>
                    <Link href="/gear-rental" className="text-xs text-tungsten hover:underline">
                      All gear rental &rarr;
                    </Link>
                  </NavigationMenuLink>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-1">
                  {GEAR_CATEGORIES.map((c) => (
                    <MenuRow key={c.href} {...c} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <FeatureCard
                  href="/gear-rental"
                  src="/images/gear/phase-one.jpg"
                  alt="Phase One medium-format camera system"
                  eyebrow="The Gear House"
                  title="Take it anywhere."
                  cta="Browse all gear"
                />
                <div className="rounded-card border border-hairline p-4">
                  <p className="text-sm font-medium text-bone">Pickup or delivery</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Pick up at the shop, or we deliver anywhere within 500 miles of Denver. We don&rsquo;t ship.
                  </p>
                  <div className="mt-3 flex flex-col gap-1">
                    <SideLink href="/request-estimate" label="Request a Quote" icon={FileText} />
                    <SideLink href="/insurance" label="Insurance & COI" icon={ShieldCheck} />
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
}
