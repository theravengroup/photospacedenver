/**
 * Server-side gallery file lists for the two thumbnail marquees on /.
 * Read once at module load via Node fs (we're only used in server
 * components / build-time contexts) so we don't have to maintain
 * hard-coded arrays as Dan adds or removes photos.
 *
 * Returned paths are public URLs (relative to the site root), ready to
 * drop into <Image src=…>.
 */

import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function listWebp(folder: string): string[] {
  const dir = path.join(PUBLIC_DIR, folder);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.webp$/i.test(f))
      .sort()
      .map((f) => `/${folder}/${f}`);
  } catch {
    return [];
  }
}

export const STUDIO_GALLERY_FILES = listWebp("images/shot-gallery");
export const GEAR_GALLERY_FILES = listWebp("images/gear-gallery");

/**
 * Fisher–Yates shuffle. Called from server components that want a fresh
 * per-render order. Lives here (not in the marquee component) so the
 * component itself stays pure — react-hooks/purity flags Math.random()
 * inside a component body even when the component is server-side.
 */
export function shuffleGallery<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    // eslint-disable-next-line react-hooks/purity
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
