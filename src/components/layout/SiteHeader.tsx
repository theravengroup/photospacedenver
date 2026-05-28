"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { NAV_PRIMARY, BOOKING, CTA_LABELS, type NavItem } from "@/lib/content/site-config";
import { Button } from "@/components/ui/Button";

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="opacity-60">
      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function DesktopItem({ item }: { item: NavItem }) {
  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="px-3 py-2 text-sm text-bone/80 transition-colors hover:text-bone"
      >
        {item.label}
      </Link>
    );
  }
  return (
    <div className="group relative">
      <Link
        href={item.href}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-bone/80 transition-colors hover:text-bone"
      >
        {item.label}
        <Chevron />
      </Link>
      <div className="invisible absolute left-0 top-full translate-y-1 pt-3 opacity-0 transition-all duration-200 ease-cinematic group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="w-72 rounded-card border border-hairline bg-ink/95 p-2 shadow-2xl backdrop-blur">
          {item.children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block rounded px-3 py-2 transition-colors hover:bg-white/5"
            >
              <span className="block text-sm text-bone">{c.label}</span>
              {c.blurb && <span className="mt-0.5 block text-xs text-muted">{c.blurb}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-cinematic",
        scrolled || open ? "border-b border-hairline bg-ink/85 backdrop-blur" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link href="/" aria-label="photospace Denver — home" className="inline-flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand wordmark logo */}
          <img src="/images/brand/photospace-logo-small.png" alt="photospace" className="h-6 w-auto sm:h-7" />
          <span className="hidden text-[0.625rem] uppercase tracking-[0.22em] text-tungsten sm:inline">Denver</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_PRIMARY.map((item) => (
            <DesktopItem key={item.href} item={item} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button href={BOOKING.bookPath} size="sm" className="hidden lg:inline-flex">
            {CTA_LABELS.checkAvailability}
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-bone lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={cn("absolute left-0 block h-px w-5 bg-current transition-transform", open ? "top-1.5 rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 top-1.5 block h-px w-5 bg-current transition-opacity", open && "opacity-0")} />
              <span className={cn("absolute left-0 block h-px w-5 bg-current transition-transform", open ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-hairline bg-ink lg:hidden",
          open ? "max-h-[80vh] overflow-y-auto" : "max-h-0",
          "transition-[max-height] duration-300 ease-cinematic",
        )}
      >
        <nav className="px-5 py-4" aria-label="Mobile" onClick={() => setOpen(false)}>
          {NAV_PRIMARY.map((item) => (
            <div key={item.href} className="border-b border-hairline py-1 last:border-0">
              <Link href={item.href} className="block py-2 text-base text-bone">
                {item.label}
              </Link>
              {item.children && (
                <div className="pb-2 pl-3">
                  {item.children.map((c) => (
                    <Link key={c.href} href={c.href} className="block py-1.5 text-sm text-muted">
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-5">
            <Button href={BOOKING.bookPath} size="md" className="flex-1">
              {CTA_LABELS.bookStudio}
            </Button>
            <Button href="/memberships" variant="outline" size="md" className="flex-1">
              {CTA_LABELS.viewMemberships}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
