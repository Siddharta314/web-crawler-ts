import { JSDOM } from "jsdom";

export function normalizeURL(url: string) {
  const myURL = new URL(url);

  const hostPath = `${myURL.hostname}${myURL.pathname}`;
  return hostPath.endsWith("/") ? hostPath.slice(0, -1) : hostPath;
}

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
