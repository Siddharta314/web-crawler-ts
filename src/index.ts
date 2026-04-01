import { crawlSiteAsync } from "./concurrentCrawler";
import { writeJSONReport } from "./report";

async function main() {
  if (process.argv.length !== 5) {
    console.log("Wrong argument number");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  const maxConcurrency = parseInt(process.argv[3]);
  const maxPages = parseInt(process.argv[4]);
  console.log("Starting craweler for " + baseURL);
  try {
    const pages = await crawlSiteAsync(baseURL, maxConcurrency, maxPages);
    // console.log(pageData);
    console.log(`Crawled ${Object.keys(pages).length} pages.`);
    console.log("Finished crawling.");
    console.log("Writing report...");
    writeJSONReport(pages);
    console.log("Done! See you next time!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
