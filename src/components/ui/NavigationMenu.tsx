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

const triggerClass =
  "group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-bone/80 transition-colors hover:text-bone focus-visible:text-bone data-[state=open]:text-bone";

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger className={cn(triggerClass, className)} {...props}>
      {children}
      <ChevronDown
        className="size-3 opacity-60 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180"
        aria-hidden
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
