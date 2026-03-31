import { JSDOM } from "jsdom";

type ExtractedPageData = {
  url: string;
  heading: string;
  firstParagraph: string;
  outgoingLinks: string[];
  imageURLs: string[];
};

//Record<string, number>

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
