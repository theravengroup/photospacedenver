/**
 * Route-change transition. A template (unlike a layout) re-mounts on every
 * navigation, so the CSS fade in `.page-transition` replays each time — giving
 * a smooth, cinematic settle between pages. Opacity-only + reduced-motion-aware
 * (see globals.css), so it never traps fixed/sticky descendants.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
