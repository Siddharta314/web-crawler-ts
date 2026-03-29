import { describe, it, expect } from "vitest";
import { normalizeURL } from "./crawl";

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
