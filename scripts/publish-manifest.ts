import fs from "node:fs";
import path from "node:path";
import { extractPoster, publishVideo, type PublishSection } from "./lib/publish";

type ManifestEntry = {
  file: string;
  section: PublishSection;
  publish: string;
  title: string;
  subtitle?: string | null;
  description: string;
};

function arg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function findFiles(root: string) {
  const matches = new Map<string, string[]>();
  async function walk(directory: string): Promise<void> {
    for (const entry of await fs.promises.readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(file);
      else {
        const key = entry.name.normalize("NFC");
        const list = matches.get(key) ?? [];
        list.push(file);
        matches.set(key, list);
      }
    }
  }
  await walk(root);
  return matches;
}

async function main() {
  const manifestPath = arg("--manifest");
  const attachmentsDir = arg("--dir");
  if (!manifestPath || !attachmentsDir) {
    throw new Error("Required: --manifest <path> --dir <attachments root>");
  }
  const manifest = JSON.parse(
    await fs.promises.readFile(path.resolve(manifestPath), "utf8"),
  ) as ManifestEntry[];
  const files = await findFiles(path.resolve(attachmentsDir));
  const posterDir = "/home/ubuntu/posters-final";
  await fs.promises.mkdir(posterDir, { recursive: true });
  const failures: Array<{ title: string; file: string; error: string }> = [];
  for (const entry of manifest) {
    const filename = path.basename(entry.file).normalize("NFC");
    const candidates = files.get(filename) ?? [];
    if (candidates.length !== 1) {
      const error = `${entry.file}: expected one matching source, found ${candidates.length}`;
      failures.push({ title: entry.title, file: entry.file, error });
      console.error(`FAILED ${entry.title}: ${error}`);
      continue;
    }
    const source = candidates[0];
    const slug = entry.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const poster = path.join(posterDir, `${slug}.jpg`);
    try {
      const posterResult = extractPoster(source, poster, { fallbackText: entry.title });
      const result = await publishVideo({
        file: source,
        thumbnail: poster,
        section: entry.section,
        title: entry.title,
        subtitle: entry.subtitle,
        description: entry.description,
        publish: entry.publish,
      });
      console.log(
        `Published ${entry.title} (${result.slug}) poster=${
          posterResult.fallback ? "fallback" : posterResult.attempt?.toFixed(2)
        } luma=${posterResult.meanLuma.toFixed(1)}`,
      );
    } catch (error) {
      failures.push({ title: entry.title, file: entry.file, error: String(error) });
      console.error(`FAILED ${entry.title}: ${String(error)}`);
    }
  }
  if (failures.length) {
    throw new Error(`${failures.length} manifest entries failed: ${JSON.stringify(failures)}`);
  }
}

void main();
