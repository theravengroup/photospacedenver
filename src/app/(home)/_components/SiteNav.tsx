"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { CONTACT, LINKS, NAV_PRIMARY } from "../_data/site";
import { Wordmark } from "./Wordmark";
import { OutboundIcon } from "./OutboundIcon";

/**
 * Sticky, minimal nav.
 *
 * - Paper-toned, hairline-bottom, translucent with backdrop blur
 *   when the user has scrolled past a threshold.
 * - Studio link is outbound (photospace.studio) with a small icon.
 * - On mobile, items collapse into a slide-down sheet.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "bg-paper/85 backdrop-blur-md border-b border-hair"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          aria-label="PhotoSpace Denver — home"
          className="shrink-0"
        >
          <Wordmark />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8"
        >
          {NAV_PRIMARY.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-graphite hover:text-ink transition-colors"
              >
                {item.label}
                <OutboundIcon className="text-stone group-hover:text-copper transition-colors" />
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-graphite hover:text-ink transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right side: phone + primary CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={CONTACT.phoneHref}
            className="text-sm font-medium tracking-tight text-graphite hover:text-ink transition-colors"
          >
            {CONTACT.phone}
          </a>
          <Link
            href={LINKS.estimate}
            className="inline-flex h-9 items-center justify-center rounded-full bg-ink px-4 text-sm font-medium text-paper hover:bg-graphite transition-colors"
          >
            Request estimate
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-hair bg-paper/60"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span
            className={cn(
              "relative block h-3.5 w-5",
              "before:absolute before:left-0 before:right-0 before:h-px before:bg-ink before:transition-transform",
              "after:absolute after:left-0 after:right-0 after:h-px after:bg-ink after:transition-transform",
              open
                ? "before:top-1/2 before:rotate-45 after:top-1/2 after:-rotate-45"
                : "before:top-0 after:bottom-0"
            )}
          />
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        className={cn(
          "md:hidden overflow-hidden border-t border-hair",
          "transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav
          aria-label="Mobile"
          className="mx-auto flex max-w-[1280px] flex-col gap-1 px-6 py-6"
        >
          {NAV_PRIMARY.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-md px-2 py-3 text-lg font-medium text-graphite hover:bg-bone"
              >
                <span>{item.label}</span>
                <OutboundIcon className="text-stone" />
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-lg font-medium text-graphite hover:bg-bone"
              >
                {item.label}
              </Link>
            )
          )}
          <div className="mt-4 flex flex-col gap-3 border-t border-hair pt-6">
            <a
              href={CONTACT.phoneHref}
              className="text-base font-medium text-graphite"
            >
              {CONTACT.phone}
            </a>
            <a
              href={CONTACT.emailHref}
              className="text-base font-medium text-graphite"
            >
              {CONTACT.email}
            </a>
            <Link
              href={LINKS.estimate}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-paper"
            >
              Request estimate
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
