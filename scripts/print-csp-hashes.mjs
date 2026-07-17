// Prints the CSP 'sha256-...' values for every inline <script> in the built
// site. Run `npm run build` first, then `node scripts/print-csp-hashes.mjs`.
//
// vercel.json's script-src pins these by hash (no 'unsafe-inline') so that an
// injected inline script can't execute even if something else on the page is
// compromised. That means any edit to an inline <script> block — the
// Vercel Analytics bootstrap in Layout.astro, the theme-switcher in
// index.astro, or the sidebar scroll-highlight in docs.astro — changes its
// hash and silently breaks that script in production until vercel.json is
// updated with the new value printed here.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const DIST = new URL("../dist", import.meta.url).pathname;

function findHtmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return findHtmlFiles(full);
    return name.endsWith(".html") ? [full] : [];
  });
}

const seen = new Map();

for (const file of findHtmlFiles(DIST)) {
  const html = readFileSync(file, "utf8");
  const scripts = html.matchAll(/<script(?:\s+type="([^"]*)")?[^>]*>([\s\S]*?)<\/script>/g);
  for (const [, type, content] of scripts) {
    if (type === "application/ld+json" || !content.trim()) continue;
    const hash = createHash("sha256").update(content).digest("base64");
    const value = `'sha256-${hash}'`;
    if (!seen.has(value)) seen.set(value, []);
    seen.get(value).push(file.replace(DIST, "dist"));
  }
}

console.log("script-src hashes found in dist/:\n");
for (const [hash, files] of seen) {
  console.log(hash);
  for (const f of files) console.log(`  used in ${f}`);
}
console.log("\nCompare against script-src in vercel.json — add any new hash, remove any that's gone.");
