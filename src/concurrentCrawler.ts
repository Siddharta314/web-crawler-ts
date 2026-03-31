import pLimit from "p-limit";
import { getURLsFromHTML, normalizeURL } from "./crawl";

type Pages = Record<string, number>;

class ConcurrentCrawler {
  private limit;
  private pages: Pages;
  constructor(
    private baseURL: string,
    maxConcurrency: number = 1,
  ) {
    this.pages = {};
    this.limit = pLimit(maxConcurrency);
  }
  private addPageVisit(normalizedURL: string): boolean {
    if (this.pages[normalizedURL]) {
      this.pages[normalizedURL]++;
      return false;
    }
    this.pages[normalizedURL] = 1;
    return true;
  }

  private async getHTML(currentURL: string): Promise<string> {
    return await this.limit(async () => {
      try {
        const response = await fetch(currentURL, {
          method: "GET",
          headers: {
            "User-Agent": "BootCrawler/1.0",
          },
        });
        if (response.status > 399) {
          throw new Error(
            `Got HTTP error: ${response.status} ${response.statusText}`,
          );
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("text/html")) {
          throw new Error(`Got non-HTML response: ${contentType}`);
        }
        return response.text();
      } catch (err) {
        console.log(`Error fetching ${currentURL}: ${(err as Error).message}`);
        return "";
      }
    });
  }

  private async crawlPage(currentURL: string): Promise<void> {
    const currentURLObj = new URL(currentURL);
    const baseURLObj = new URL(this.baseURL);
    if (currentURLObj.hostname !== baseURLObj.hostname) {
      return;
    }
    const normalizedCurrentURL = normalizeURL(currentURL);
    if (!this.addPageVisit(normalizedCurrentURL)) {
      return;
    }

    let html = "";
    try {
      html = await this.getHTML(currentURL);
    } catch (err) {
      console.log(`${(err as Error).message}`);
      return;
    }
    if (!html) return;

    try {
      const nextURLs = getURLsFromHTML(html, this.baseURL);
      const crawlPromises = nextURLs.map((nextURL) => this.crawlPage(nextURL));
      await Promise.all(crawlPromises);
    } catch (error) {
      console.error(`Error crawling ${currentURL}:`, error);
    }
    return;
  }

  async crawl(): Promise<Pages> {
    await this.crawlPage(this.baseURL);
    return this.pages;
  }
}

export function crawlSiteAsync(
  baseURL: string,
  maxConcurrency: number = 5,
): Promise<Pages> {
  const crawler = new ConcurrentCrawler(baseURL, maxConcurrency);
  return crawler.crawl();
}
