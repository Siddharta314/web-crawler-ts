import { type ExtractedPageData, type Pages } from "./types";
import { writeFileSync } from "fs";
import * as path from "path";

export function writeJSONReport(
  pageData: Record<string, ExtractedPageData>,
  filename = "report.json",
): void {
  const sorted = Object.values(pageData).sort((a, b) =>
    a.url.localeCompare(b.url),
  );
  const json = JSON.stringify(sorted, null, 2);
  writeFileSync(path.resolve(process.cwd(), filename), json);
}
