"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget. Renders explicitly into a ref'd div and mirrors
 * the token into a hidden input named "cf-turnstile-response" so it rides along
 * in FormData. If NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (local dev / before
 * keys are provisioned) it renders nothing and the server skips verification.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileField() {
  const ref = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!SITE_KEY) return;
    let widgetId: string | undefined;
    let poll: ReturnType<typeof setInterval> | undefined;

    const render = () => {
      if (!ref.current || !window.turnstile || widgetId) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        theme: "dark",
        callback: (t: string) => setToken(t),
        "error-callback": () => setToken(""),
        "expired-callback": () => setToken(""),
      });
    };

    if (window.turnstile) {
      render();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      poll = setInterval(() => {
        if (window.turnstile) {
          if (poll) clearInterval(poll);
          render();
        }
      }, 120);
    }

    return () => {
      if (poll) clearInterval(poll);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  if (!SITE_KEY) return null;

  return (
    <div>
      <div ref={ref} />
      <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
    </div>
  );
}
