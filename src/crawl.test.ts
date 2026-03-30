import { describe, it, expect } from "vitest";
import {
  normalizeURL,
  getHeadingFromHTML,
  getFirstParagraphFromHTML,
  getURLsFromHTML,
  getImagesFromHTML,
} from "./crawl";

describe("normalizeURL", () => {
  it("normalizes a URL by lowercasing the host and removing a trailing slash", () => {
    const input = "https://BLOG.boot.dev/path/";
    expect(normalizeURL(input)).toBe("blog.boot.dev/path");
  });

  it("removes the trailing slash for root URLs", () => {
    expect(normalizeURL("https://blog.boot.dev/")).toBe("blog.boot.dev");
  });

  it("strips the query string from the URL", () => {
    expect(normalizeURL("https://blog.boot.dev/path?query=1&x=2")).toBe(
      "blog.boot.dev/path",
    );
  });

  it("handles http and urls without a trailing slash", () => {
    expect(normalizeURL("http://blog.boot.dev/path")).toBe(
      "blog.boot.dev/path",
    );
  });
});

describe("getHeadingFromHTML", () => {
  it("getHeadingFromHTML basic", () => {
    const inputBody = `<html><body><h1>Test Title</h1></body></html>`;
    const actual = getHeadingFromHTML(inputBody);
    const expected = "Test Title";
    expect(actual).toEqual(expected);
  });
});

describe("getFirstParagraphFromHTML", () => {
  it("getFirstParagraphFromHTML main priority", () => {
    const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>
  `;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = "Main paragraph.";
    expect(actual).toEqual(expected);
  });
});

describe("getURLsFromHTML", () => {
  it("getURLsFromHTML absolute", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>`;

    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/path/one"];

    expect(actual).toEqual(expected);
  });
  it("getURLsFromHTML multiple links", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `
      <html>
        <body>
          <a href="/path/one"><span>Link One</span></a>
          <a href="https://other-site.com/path/two"><span>Link Two</span></a>
        </body>
      </html>`;

    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = [
      "https://crawler-test.com/path/one",
      "https://other-site.com/path/two",
    ];

    expect(actual).toEqual(expected);
  });

  it("getURLsFromHTML handles invalid URLs gracefully", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `
      <html>
        <body>
          <a href="invalid-path"><span>Bad Link</span></a>
        </body>
      </html>`;

    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/invalid-path"];

    expect(actual).toEqual(expected);
  });
});

describe("getImagesFromHTML", () => {
  it("getImagesFromHTML relative", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><img src="/logo.png" alt="Logo"></body></html>`;

    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/logo.png"];

    expect(actual).toEqual(expected);
  });
  it("getImagesFromHTML multiple images and absolute URLs", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `
      <html>
        <body>
          <img src="/assets/cat.jpg">
          <img src="https://cdn.com/dog.png">
        </body>
      </html>`;

    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = [
      "https://crawler-test.com/assets/cat.jpg",
      "https://cdn.com/dog.png",
    ];

    expect(actual).toEqual(expected);
  });

  it("getImagesFromHTML ignores images without a src", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `
      <html>
        <body>
          <img alt="Just a placeholder">
          <img src="/valid-image.gif">
        </body>
      </html>`;

    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/valid-image.gif"];

    expect(actual).toEqual(expected);
  });
});
