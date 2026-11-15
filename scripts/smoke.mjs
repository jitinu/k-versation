// Live-site smoke check: pages, every video page, and each video's media files.
const BASE = (process.env.SMOKE_BASE || "https://k-versationxyz.vercel.app").replace(/\/$/, "");
const BAD_TEXT = ["Application error", "Something didn&#x27;t load", "Something didn't load"];
const failures = [];

async function request(url, init = {}) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(20000),
        redirect: "follow",
      });
      if (res.status === 200 || res.status === 206) return res;
      last = `HTTP ${res.status}`;
      await res.body?.cancel();
    } catch (error) {
      last = String(error?.message ?? error);
    }
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  throw new Error(last);
}

async function page(path) {
  try {
    const html = await (await request(BASE + path)).text();
    const bad = BAD_TEXT.find((t) => html.includes(t));
    if (bad) throw new Error(`page shows "${bad}"`);
    return html;
  } catch (error) {
    failures.push(`${path}: ${error.message}`);
    return "";
  }
}

async function media(label, url) {
  try {
    const res = await request(url, { headers: { Range: "bytes=0-0" } });
    await res.body?.cancel();
  } catch (error) {
    failures.push(`${label} ${url}: ${error.message}`);
  }
}

async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (queue.length) await fn(queue.shift());
    }),
  );
}

const staticPaths = [
  "/",
  "/conversations",
  "/monologues",
  "/about",
  "/questions",
  "/privacy",
  "/terms",
  "/sitemap.xml",
  "/robots.txt",
];
const html = {};
await pool(staticPaths, 4, async (path) => (html[path] = await page(path)));

const slugs = new Set();
for (const path of ["/conversations", "/monologues"]) {
  for (const match of (html[path] || "").matchAll(/href="\/video\/([^"?#]+)"/g))
    slugs.add(match[1]);
}
if (slugs.size < 100) failures.push(`only ${slugs.size} video links found on archive pages`);

let mediaChecked = 0;
await pool([...slugs], 8, async (slug) => {
  const body = await page(`/video/${slug}`);
  if (!body) return;
  const src =
    body.match(/<video[^>]*\ssrc="([^"]+\.mp4)"/)?.[1] ??
    body.match(/src="(https:[^"]+\.mp4)"/)?.[1];
  const poster = body.match(/poster="([^"]+)"/)?.[1];
  if (!src) failures.push(`/video/${slug}: no mp4 found`);
  else await media("video", src);
  if (!poster) failures.push(`/video/${slug}: no poster found`);
  else await media("poster", poster);
  mediaChecked++;
});

console.log(
  `Checked ${staticPaths.length} pages, ${slugs.size} video pages, ${mediaChecked} media pairs on ${BASE}`,
);
if (failures.length) {
  console.error(`FAILED (${failures.length}):\n` + failures.join("\n"));
  process.exit(1);
}
console.log("All good.");
