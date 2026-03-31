import { JSDOM } from "jsdom";

type ExtractedPageData = {
  url: string;
  heading: string;
  firstParagraph: string;
  outgoingLinks: string[];
  imageURLs: string[];
};

export function normalizeURL(url: string) {
  const myURL = new URL(url);

  const hostPath = `${myURL.hostname}${myURL.pathname}`;
  return hostPath.endsWith("/") ? hostPath.slice(0, -1) : hostPath;
}

export function getHeadingFromHTML(html: string): string {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const firstHeading =
    document.querySelector("h1") || document.querySelector("h2");
  return firstHeading ? firstHeading.textContent : "";
}

export function getFirstParagraphFromHTML(html: string): string {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const main = document.querySelector("main");
  const firstParagraph =
    main?.querySelector("p") || document.querySelector("p");
  return firstParagraph ? firstParagraph.textContent : "";
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const URLs = document.querySelectorAll("a[href]");
  return Array.from(URLs)
    .filter((url) => url.getAttribute("href"))
    .map((url) => new URL(url.getAttribute("href")!, baseURL).toString());
}

export function getImagesFromHTML(html: string, baseURL: string): string[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const images = document.querySelectorAll("img[src]");
  return Array.from(images)
    .filter((img) => img.getAttribute("src"))
    .map((img) => new URL(img.getAttribute("src")!, baseURL).toString());
}

export function extractPageData(
  html: string,
  pageURL: string,
): ExtractedPageData {
  return {
    url: pageURL,
    heading: getHeadingFromHTML(html),
    firstParagraph: getFirstParagraphFromHTML(html),
    outgoingLinks: getURLsFromHTML(html, pageURL),
    imageURLs: getImagesFromHTML(html, pageURL),
  };
}

async function getHTML(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "BootCrawler/1.0",
    },
  });
  if (response.status !== 200) {
    console.log("Failed to fetched, status code: " + response.status);
  }
  if (response.headers.get("content-type") !== "text/html") {
    console.log("Content type is not text/html");
  }

  return response.text();
}

export async function crawlPage(
  baseURL: string,
  currentURL: string = baseURL,
  pages: Record<string, number> = {},
): Promise<Record<string, number>> {
  const normalizedCurrentURL = normalizeURL(currentURL);
  const currentURLObj = new URL(currentURL);
  const baseURLObj = new URL(baseURL);
  if (currentURLObj.hostname !== baseURLObj.hostname) {
    return pages;
  }
  if (pages[normalizedCurrentURL]) {
    pages[normalizedCurrentURL]++;
    return pages;
  }
  pages[normalizedCurrentURL] = 1;

  let html = "";
  try {
    html = await getHTML(currentURL);
  } catch (err) {
    console.log(`${(err as Error).message}`);
    return pages;
  }
  if (!html) return pages;

  try {
    const pageData = extractPageData(html, currentURL);

    const outgoingLinks = pageData.outgoingLinks;
    for (const link of outgoingLinks) {
      pages = await crawlPage(baseURL, link, pages);
    }
  } catch (error) {
    console.error(`Error crawling ${currentURL}:`, error);
  }

  return pages;
}

/*  using regex   */
// export function getHeadingFromHTML(html: string): string {
//   const firstHeading = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
//   if (!firstHeading) {
//     const secondHeading = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
//     if (!secondHeading) {
//       return "";
//     }
//     return secondHeading[1];
//   }
//   return firstHeading[1];
// }
