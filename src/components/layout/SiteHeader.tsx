"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { NAV_PRIMARY, CTA_LABELS, BOOKING } from "@/lib/content/site-config";
import { Button } from "@/components/ui/Button";
import { MegaMenu } from "@/components/layout/MegaMenu";

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
        scrolled || open ? "border-b border-hairline glass" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link href="/" aria-label="photospace Denver — home" className="inline-flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand wordmark logo */}
          <img src="/images/brand/photospace-logo-small.png" alt="photospace" className="h-6 w-auto sm:h-7" />
          <span className="hidden text-[0.625rem] uppercase tracking-[0.22em] text-tungsten sm:inline">Denver</span>
        </Link>

        <MegaMenu className="hidden lg:flex" />

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
