import fs from "node:fs";
import { publishVideo, type PublishSection } from "./lib/publish";

function arg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
const file = arg("--file");
const section = arg("--section") as PublishSection | undefined;
const title = arg("--title");
const subtitle = arg("--subtitle") ?? null;
const descriptionFile = arg("--description-file");
const publish = arg("--publish");
if (
  !file ||
  !title ||
  !descriptionFile ||
  !publish ||
  !section ||
  !["conversation", "monologue", "intro"].includes(section)
)
  throw new Error("Required: --file --section --title --description-file --publish");
async function main() {
  const result = await publishVideo({
    file: file!,
    thumbnail: arg("--thumbnail"),
    section: section!,
    title: title!,
    subtitle,
    description: await fs.promises.readFile(descriptionFile!, "utf8"),
    publish: publish!,
  });
  console.log(`Published ${title} (${result.slug})`);
}
void main();
