"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Accessible mega-menu primitives, adapted from shadcn/ui's NavigationMenu
 * (Radix under the hood) and restyled to photospace's dark system: bone text,
 * tungsten accent, hairline borders, ink panel. The shared viewport is centered
 * under the menu and morphs smoothly between panels.
 */

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn("relative z-50 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  );
}

const NavigationMenuItem = NavigationMenuPrimitive.Item;

/**
 * Trigger pill — bigger + bolder per Dan's IA review.
 * Adds a sliding tungsten underline that fades in on hover/open and a
 * subtle tungsten-tinted background pill on hover, so the nav reads as
 * something to interact with (not a label string).
 */
const triggerClass = cn(
  "group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2.5",
  "text-base font-medium text-bone/85",
  "transition-all duration-200 ease-cinematic",
  "hover:text-bone hover:bg-tungsten/10",
  "focus-visible:text-bone",
  "data-[state=open]:text-bone data-[state=open]:bg-tungsten/15",
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger className={cn(triggerClass, className)} {...props}>
      {children}
      <ChevronDown
        className="size-3.5 opacity-60 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180 group-data-[state=open]:opacity-100"
        strokeWidth={2}
        aria-hidden
      />
      {/* Sliding underline — hidden by default, slides in from center on
          hover or open. Uses the photospace brand lime (--color-brand-green
          = #97b800) for the wordmark-tied accent. Pure CSS, no JS. Bumped
          to 1.5px so the green reads at speed. */}
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 -bottom-1 h-[1.5px] w-0 -translate-x-1/2 rounded-full bg-[var(--color-brand-green)]",
          "transition-[width,opacity] duration-300 ease-cinematic opacity-0",
          "group-hover:w-8 group-hover:opacity-100",
          "group-data-[state=open]:w-10 group-data-[state=open]:opacity-100",
        )}
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "left-0 top-0 w-full md:absolute md:w-auto",
        "data-[motion^=from-]:animate-[nav-in_220ms_ease-out] data-[motion^=to-]:animate-[nav-out_180ms_ease-in]",
        className,
      )}
      {...props}
    />
  );
}

const NavigationMenuLink = NavigationMenuPrimitive.Link;

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-1/2 top-full flex -translate-x-1/2 justify-center">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "relative mt-3 origin-top overflow-hidden rounded-card border border-hairline glass-overlay text-bone shadow-2xl",
          "h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)]",
          "transition-[width,height] duration-300 ease-out",
          "data-[state=open]:animate-[nav-in_220ms_ease-out] data-[state=closed]:animate-[nav-out_180ms_ease-in]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
};
