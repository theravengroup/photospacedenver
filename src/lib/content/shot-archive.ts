import fs from "node:fs";
import path from "node:path";

export type Shot = { src: string; alt: string };

/**
 * Real "shot here" gallery — read straight from the folder at build time, so
 * dropping new images into public/images/shot-at-photospace/ surfaces them in
 * the gallery on the next build (no code change needed). Shared by /studio and
 * the studio SEO landing pages.
 */
export function getShotArchive(): Shot[] {
  return fs
    .readdirSync(path.join(process.cwd(), "public/images/shot-at-photospace"))
    .filter((f) => /\.(webp|jpe?g|png)$/i.test(f))
    .sort()
    .map((file) => ({
      src: `/images/shot-at-photospace/${file}`,
      alt: "Work shot at photospace",
    }));
}
